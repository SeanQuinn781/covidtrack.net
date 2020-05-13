const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // for non-dockerized development change both targets to use http://localhost:5000/  instead of  http://api/
  app.use(
    createProxyMiddleware(
      '/covid', 
      { 
        // target : 'http://api/', 
        target : 'http://localhost:5000',
	      changeOrigin: true
      }
    )
  );
  app.use(
    createProxyMiddleware(
      '/covidUnitedStates', 
      { 
        // target : 'http://api/',
        target : 'http://localhost:5000',
        changeOrigin: true 
      }
    )
  );
  app.use(
    createProxyMiddleware(
      '/covidUnitedStatesCounties', 
      { 
        // target : 'http://api/',
        target : 'http://localhost:5000',
        changeOrigin: true 
      }
    )
  );
};
