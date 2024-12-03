const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express()


dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('combined')); 
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

mongoose.connect('mongodb://localhost:27017/audioBooks', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
  });
  app.use(limiter)  
  app.use('/static', express.static(path.join(__dirname, 'files')));
  app.get('/',(req,res)=>{
        res.send("audio book server running")
   })


    app.listen(PORT,()=>{
        console.log(`server started at ${PORT}`)
    })