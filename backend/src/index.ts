import 'reflect-metadata';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { dataSource } from './ormconfig';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT
app.use(cors());

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// app.use('/auth', authRoutes);

app.get('/sync', async (req, res) => {
  await dataSource.synchronize()
  .then(() => {
    console.log("database synchronized");
    
  }).catch((err:any) => {
    console.error("Error  Data Source initialization", err);
  })
  res.send('database synchronized');
  process.exit()
});



