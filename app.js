//requiring core modules
const path = require('path');

//requiring 3rd party modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const hpp = require('hpp');

//requiring local modules
const AppError = require('./utils/AppError');
const GlobalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const answerRouter = require('./routes/answerRoutes');
const commentRouter = require('./routes/commentRoutes');

//initializing express
const app = express();
app.use(cors({ credentials: true, origin: true }));

//logging on dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middlewares related to secuirity
app.use(helmet());

const limiter = rateLimit({
  max: 200,
  windowMs: 15 * 60 * 1000,
  message: { message: 'To many requests from this IP | try again in an hour' },
});

app.use('/api', limiter);

//initializing body parser and more secuirity middlewares
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

//middlewares for routes in api
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/answers', answerRouter);
app.use('/api/v1/comments', commentRouter);

//middleware for handling unknown routes
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} route on this server!!!`, 404)
  );
});

//globar error handler
app.use(GlobalErrorHandler);
module.exports = app;
