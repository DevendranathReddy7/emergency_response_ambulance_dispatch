const express  = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('connected to mongoDB!')
  } catch (e: any) {
    console.log('something went wrong', e.message)
  }
}

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  });
});
