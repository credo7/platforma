const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://api.power-games.me",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
};
