import mongoose from 'mongoose';

const connectDatabase = () => {
  return mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(`mongodb connected with server: ${res.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
  //if we comment or remove catch block then unhandled error will be trigged at server.js and shutdonw the server
};

export default connectDatabase;
