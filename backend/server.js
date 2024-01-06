import { app } from './app.js';
import dotEnv from 'dotenv';
import connectDatabase from './config/dabase.js';
import cloudinary from 'cloudinary';
//Handling Uncaught Exceptions like variables without defined
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Promise Rejection`);
  process.exit(1);
});

//config env file
dotEnv.config({ path: 'backend/config/config.env' });

//database connection
connectDatabase();

//setting cloudinary to upload files
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('server is running on', PORT);
});

// console.log(youtube); //testing uncaught error

//unhandled promise rejection
// this for unhandled if we dont give catch block and db connection time then this will work otherwise not
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
