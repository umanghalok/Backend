// inconsitent--->require('dotenv').config({path: './env'})
import dotenv from "dotenv"; 
import connectDB from "./db/index.js";
import {app} from "./app.js"
dotenv.config({
    path:'./env'
})
const port = 8000
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })
connectDB();

/*
sabkuchh ek index.js me hi likh do, ya fir import krke kaam karo..modular code banao


import mongoose from "mongoose";
import {DB_NAME} from "./constants";
import express from "express"
const app=express()

;(async()=>{
    try
    {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERR: ", error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("ERROR: ",error)
        throw err
    }
})()
*/