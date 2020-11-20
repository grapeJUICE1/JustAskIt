const mongoose = require('mongoose');
const dotenv = require('dotenv');

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

//initializing mongoose and mongodb
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected Successfully');
  });

const port = process.env.PORT;

//spinning up the server
const server = app.listen(port, () => {
  console.log(`server is up and running at port ${port}`);
});

//handling unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
