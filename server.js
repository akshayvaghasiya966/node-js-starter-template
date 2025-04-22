const express = require('express')
const passport = require('passport');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/user.route');
const morgan = require('morgan');
const requestTime = require('./middlewares/requestTime');
require('dotenv').config()
const configurePassport = require('./config/passport.config');
const errorHandler = require('./middlewares/errorHandler');
const securityMiddleware = require('./middlewares/security');
const app = express();

// Connect to MongoDB
connectDB();


// Dev mode logging
app.use(morgan('dev'));

// Apply all security middlewares at once
securityMiddleware(app);

// requestTime
app.use(requestTime);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ✅ Initialize Passport
configurePassport(passport);
app.use(passport.initialize());

// Routes
app.use('/api/user', userRoutes);

// ✅ Custom error handler middleware
app.use(errorHandler);

const port = 5000

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})