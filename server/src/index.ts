import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {categoriesRouter} from './routes/categories';
import {ordersRouter} from './routes/orders';
import {initializeCategories} from './utils/initData';
import {errorHandler} from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-list';

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => {
  res.json({status: 'OK', timestamp: new Date().toISOString()});
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({error: 'Route not found'});
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await initializeCategories();
    console.log('Categories initialized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
});

startServer();
