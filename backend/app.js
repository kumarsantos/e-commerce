import express from 'express';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoute.js';
import errorMiddleware from './middleware/error.js';
import CookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
export const app = express();

//inbuilt middlewares
app.use(express.json());
app.use(CookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(fileUpload());
app.use(cors());

//routes
app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

//Middlewares for Errors
app.use(errorMiddleware);
