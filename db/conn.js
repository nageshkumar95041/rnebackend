const mongoose=require("mongoose");
const db=process.env.DB;



mongoose.connect(db,{
    
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("connected to database successfully")).catch((err)=>console.log(err.message))
