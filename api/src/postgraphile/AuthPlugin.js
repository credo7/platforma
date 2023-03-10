import { sendEmailVerify } from "../email";
import jwt from "jsonwebtoken";

const { DEV, DOMAIN, TOKEN_SECRET, TOKEN_NAME } = process.env;

const callback = {
  user_login: (result, args, context, resolveInfo) => {
    const data = result.data && result.data["@token"];

    context.delCookieToken();

    if (!data) return false;

    context.setCookieToken(data);

    return result;
  },

  user_register: (result, args, context, resolveInfo) => {
    context.delCookieToken();
    return result;
  },

  user_logout: (result, args, context, resolveInfo) => {
    context.delCookieToken();
    return result;
  },

  user_recover: (result, args, context, resolveInfo) => {
    context.delCookieToken();
    return result;
  },

  user_email_code: async (result, args, context, resolveInfo) => {
    const data = result?.data && result.data["@emailVerify"];
    if (!data) return false;

    const { email, test } = args.input;
    const code = data.emailCode.substr(0, 8);

    const info = !test && (await sendEmailVerify({ email, code }));

    return {
      data: {
        "@emailVerify": {
          ...data,
          emailCode: test ? code : "",
          success: !!info,
          info: DEV && (!!info ? JSON.stringify(info) : ""),
        },
      },
    };
  },
  user_email_verify: (result, args, context, resolveInfo) => {
    return result;
  },
  user_update: (result, args, context, resolveInfo) => {
    return result;
  },
};

const useAuth = (build) => (fieldContext) => {
  const {
    scope: { isRootMutation, pgFieldIntrospection },
  } = fieldContext;

  if (!isRootMutation || !pgFieldIntrospection) return null;

  if (Object.keys(callback).includes(pgFieldIntrospection.name)) {
    return {
      before: [],
      after: [
        { priority: 1000, callback: callback[pgFieldIntrospection.name] },
      ],
      error: [],
    };
  }
};

export default (builder) => {
  builder.hook("init", (_, build) => {
    build.addOperationHook(useAuth(build));
    return _;
  });
};

// JWT
const jwtEncode = (data) =>
  jwt.sign(data, TOKEN_SECRET, { algorithm: "HS256" });

const jwtDecode = (token) =>
  jwt.verify(token, TOKEN_SECRET, { algorithm: "HS256" });

// COOKIES
const setCookieOptions = {
  signed: true,
  httpOnly: true,
  sameSite: DEV ? "Lax" : "None",
  secure: !DEV,
  domain: DOMAIN,
  expires: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
// -- CookieToken
const getCookieToken = (req) => {
  const token = req?.signedCookies[TOKEN_NAME];
  return token && jwtDecode(token);
};
const getCookieTokenAsync = async (req) => {
  const token = req?.signedCookies && req?.signedCookies[TOKEN_NAME];
  return token && jwtDecode(token);
};
const delCookieToken = (res) => {
  return res.clearCookie(TOKEN_NAME, {
    path: "/",
    domain: DOMAIN,
  });
};
const setCookieToken = (res, data) => {
  return res.cookie(TOKEN_NAME, jwtEncode(data), setCookieOptions);
};

// FUNC
export const additionalAuth = async (req, res) => ({
  getCookieToken: () => getCookieToken(req),
  getCookieTokenAsync: async () => getCookieTokenAsync(req),
  setCookieToken: (data) => setCookieToken(res, data),
  delCookieToken: () => delCookieToken(res),
});

export const getAuthSettings = async (req, res) => {
  const isSocket = req?.protocol?.indexOf("ws://") !== -1;
  // console.log(isSocket);

  const data = isSocket ? getCookieTokenAsync(req) : getCookieToken(req);

  return {
    role: data ? data["role"] : "GUEST",
    "jwt.claims.id": data ? data["id"] : "",
  };
};
