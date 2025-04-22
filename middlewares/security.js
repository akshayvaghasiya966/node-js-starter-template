const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');

const securityMiddleware = (app) => {

    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));


    // Set security headers
    app.use(helmet({
        contentSecurityPolicy: false, // sometimes needed for frontend frameworks
        crossOriginResourcePolicy: { policy: "cross-origin" }, // allow CDN images
    })); // 🔐 Security headers


    // // 🛡 Prevent HTTP Param Pollution
    app.use(hpp({
        whitelist: ['tags', 'filters']
    }));

    

    // Rate limiting
    //   const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 100, // limit each IP to 100 requests per windowMs
    //     message: 'Too many requests from this IP, please try again later.',
    //     standardHeaders: true,
    //     legacyHeaders: false,
    //   });

    //   app.use(limiter);
};

module.exports = securityMiddleware;
