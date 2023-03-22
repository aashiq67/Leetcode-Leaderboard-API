const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err));

app.use("/", userRoutes);

app.listen(process.env.PORT, ()=>{
    console.log("listening at 5000...");
})