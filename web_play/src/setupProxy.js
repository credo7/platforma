const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/graphql",
    createProxyMiddleware({
      target: "http://web:4001",
      changeOrigin: true,
      pathRewrite: {
        "^/graphql/": "/",
      },
    })
  );
};
