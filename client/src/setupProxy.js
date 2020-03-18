const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // for non-dockerized development change target to http://localhost:5000/
  app.use(
    '/covid',
    createProxyMiddleware({
      target: 'http://api/' ,
      changeOrigin: true,
    })
  );
};
