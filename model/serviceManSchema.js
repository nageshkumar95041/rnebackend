const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv").config();
const secretKey=process.env.SECRETKEY;
const serviceManSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    userName:{
        type:String,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        trim:true
    },
    skill:{
        type:String,
        trim:true
    },
    city:{
        type:String,
        trim:true
    },
    profile_pic:{
        type:String,
        trim:true
    },
    cloudinary_id:{
        type:String,
        trim:true
    },

    text:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },

    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

serviceManSchema.methods.generateAuthToken= async function(){
    try{

        const token= jwt.sign({_id:this._id},secretKey)
         this.tokens=this.tokens.concat({token:token})
         this.save()
         return token;
    }catch(err){
     console.log(err)
    }
}

serviceManSchema.pre("save",async function(next){
  
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        this.password= await bcrypt.hash(this.password,salt)
       

    }
    
    
    next();
});


const serviceMancoll=new mongoose.model("serviceMancoll",serviceManSchema);
module.exports=serviceMancoll;