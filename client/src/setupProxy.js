const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // for non-dockerized development change both targets to use http://localhost:5000/  instead of  http://api/
  app.use(
    createProxyMiddleware(
      '/locations/world', 
      { 
        // target : 'http://api/', 
        target : 'http://localhost:5000',
        changeOrigin: true
      }
    )
  ),
  app.use(
    createProxyMiddleware(
      '/locations/us', 
      { 
        //target : 'http://api/',
        target : 'http://localhost:5000',
        changeOrigin: true 
      }
    )
  ),
  app.use(
    createProxyMiddleware(
      '/locations/uscounties', 
      { 
        //target : 'http://api/',
        target : 'http://localhost:5000',
        changeOrigin: true 
      }
    )
  )
};
