const dotenv=require("dotenv").config()
const { Router } = require("express");
const express=require("express");
const router=require("./router/serviceManRouter")
const cors=require("cors");
const cookieParser=require("cookie-parser")
require("./db/conn")

const app=express();
const port=process.env.PORT;
const url=process.env.URL;
//middleware 
app.use(cors({ origin: url, credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(router)

let visitorCount = 0;
app.use((req, res, next) => {
    visitorCount++;
    next();
  });
app.get("/",async(req,res)=>{
    try{
     const serviceMan=  await serviceMancoll.count()
     console.log(visitorCount);
      res.status(200).json(visitorCount);
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success"
        })
    }
})
app.listen(8000,()=>{
    console.log(`server is runnig at port no  ${port}`)
})
