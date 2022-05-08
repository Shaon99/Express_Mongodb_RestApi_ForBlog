const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const blogHandlar = require("./Route/blogHandler");
const userHandlar = require("./Route/userHandler");

const app = express();
app.use(express.json());
dotenv.config();

//Database Connection Mongoose
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));

//Route
app.use('/', userHandlar);
app.use('/post', blogHandlar);


//default error handler middleware
const errorHandler = (err,req,res,next)=>{
    if(res.headersSent){
       return next(err);
    }
    res.status(500).json({
        error:err
    })
}

app.use(errorHandler);

//listen to server
app.listen(process.env.PORT, () => console.log(`running on port ${process.env.PORT}`));