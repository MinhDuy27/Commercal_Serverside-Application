const Sentry = require('@sentry/node')
const {ProfilingIntegration} = require('@sentry/profiling-node')
Sentry.init({
    dsn: 'https://5f70258f9594a4e31dab372c587b95e9@o4506046310252544.ingest.sentry.io/4506046313267200',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
 
      new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
  module.exports = (app)=>{
    app.use((error,req,res,next)=>{
        Sentry.captureException(error);
        res.status(error.status || 500);
        res.json({
            error:{
                message: error.message
            }
        })
    });  

  }