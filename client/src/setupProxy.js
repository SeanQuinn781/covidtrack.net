const { createProxyMiddleware } = require('http-proxy-middleware');

// const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // for non-dockerized development change both targets to use http://localhost:5000/  instead of  http://api/
  app.use(
    createProxyMiddleware(
      '/covid', 
      { 
        target : 'http://api', 
        changeOrigin: true
      }
    )
  );
  app.use(
    createProxyMiddleware(
      '/covidUnitedStates', 
      { 
        target : 'http://api', 
        changeOrigin: true 
      }
    )
  );
};

/* old code, single proxy 

 app.use(
    '/covidUnitedStates',
    createProxyMiddleware({
      target: 'http://localhost:5000' ,
      changeOrigin: true,
    })
  );
  */
