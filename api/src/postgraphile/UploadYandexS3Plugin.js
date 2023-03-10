import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import EasyYandexS3 from "easy-yandex-s3";

const { S3_ACCESSKEY, S3_SECRETKEY, S3_BUCKET } = process.env;

const sizes = [
  { name: "icon", latter: "i", width: 16, height: 16 },
  { name: "extra small", latter: "xs", width: 32, height: 32 },
  { name: "small", latter: "s", width: 64, height: 64 },
  { name: "medium", latter: "m", width: 128, height: 128 },
  { name: "large", latter: "l", width: 256, height: 256 },
  { name: "original", latter: "o" },
];

const fields = [
  {
    fieldNames: [
      "createUser",
      "updateUserById",
      "updateUserByEmail",
      "updateUserByUsername",
    ],
    path: "users",
  },
  {
    fieldNames: ["createTournament", "updateTournamentById"],
    path: "tournaments",
  },
  {
    fieldNames: ["createTeam", "updateTeamByGameIdAndOwnerId"],
    path: "teams",
  },
];

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: S3_ACCESSKEY,
    secretAccessKey: S3_SECRETKEY,
  },
  Bucket: S3_BUCKET,
  // debug: true,
});

const s3upload = async ({ buffer, mimetype, fieldName }) => {
  if (!mimetype.includes("image")) return null;

  const field = fields.find((item) => item.fieldNames.includes(fieldName));

  const pathField = field.path || "images";
  const uuid = uuidv4();
  const pathImg = `${pathField}/${uuid}`;

  for await (const size of sizes) {
    const bufImg =
      size.width && size.height
        ? await sharp(buffer)
            .resize({
              width: size.width,
              height: size.height,
              fit: "cover",
              position: "center",
              background: {
                r: 0,
                b: 0,
                g: 0,
                alpha: 0,
              },
            })
            .normalise(true)
            .png({ progressive: true })
            .toBuffer()
        : await sharp(buffer)
            .normalise(true)
            .png({ progressive: true })
            .toBuffer();

    await s3.Upload(
      {
        buffer: bufImg,
        name: size.latter,
        mimetype,
      },
      pathImg
    );
  }

  return pathImg;
};

const getStreamData = ({ stream }) => {
  let chunks = [];
  return new Promise((resolve, reject) =>
    stream
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        let buffer = Buffer.concat(chunks);
        resolve(buffer);
      })
  );
};

export default {
  match: ({ column }) => column === "image",
  resolve: async (upload, _args, _context, _info) => {
    const { mimetype, filename, createReadStream } = upload;
    const { fieldName } = _info;

    const stream = createReadStream();

    const buffer = await getStreamData({ stream });

    const filepath = await s3upload({ buffer, mimetype, fieldName });

    return filepath;
  },
};
