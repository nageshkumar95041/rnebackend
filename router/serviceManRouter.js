const express =require("express");
const dotenv=require("dotenv").config()
const serviceMancoll=require("../model/serviceManSchema")
const userCollection=require("../model/userSchema")
const adminCollection=require("../model/adminSchema")
const cloudinary=require("../utils/cloudinary")
const upload=require("../utils/multer")
const path=require("path")
const jwt=require("jsonwebtoken")
const router=express.Router()
const bcrypt=require("bcryptjs")
const auth=require("../model/auth");
const contactCollection = require("../model/contact");





router.get('/cook', (req, res) => {
	res
		.status(202)
		.cookie('Name', 'Rahul Ahire', {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send("cookie being initialised")
});


router.post("/login",async(req,res)=>{

    try{
        const userName=req.body.userName
       const password=req.body.password
        const serviceMan=  await userCollection.findOne({userName})
        if(!serviceMan){
         res.json({error:"invalid user name",login:"false"})
        }else{

            const dbPassword=serviceMan.password
          const login= await bcrypt.compare(password,dbPassword)
        
    //  console.log(login)

        if(login){
       
                   const token=  await serviceMan.generateAuthToken()
                   res.cookie("jwt",token,{sameSite: 'None',path: '/',
                   expires: new Date(new Date().getTime() + 100 * 1000),secure:true}).json({login:true
                   })
                //    res.json({
                //     login:true,

                //    })
               


               }
               else{
                res.json({
                    login:false,

                   })
               }
            }
    }catch(err){
        res.json({
            login:true,

           })
    }
})



router.post("/serviceManRegister",upload.single('image'),async(req,res)=>{
    try{

        
        const {name,email,userName,PhoneNo,skill,city,text,password}=req.body
        if(!name || !email || !userName || !PhoneNo|| !skill || !text || !password || !city){
            res.json("please fill the required field")
        }

        


        else{

            // check userName existence
            
            const cloudRes= await cloudinary.uploader.upload(req.file.path)
            const {name,email,userName,PhoneNo,skill,city,password}=req.body
            const userNameExit= await serviceMancoll.findOne({userName})
            if(userNameExit){
               
                res.status(200).json({error:"Username already exists",exist:true})
            } 
            else{


                const serviceMan= new serviceMancoll({name:name,email:email,userName:userName,PhoneNo:PhoneNo,skill:skill,city:city,text:text,password:password,profile_pic:cloudRes.secure_url,cloudinary_id:cloudRes.public_id})
                const result= await serviceMan.save();
                res.status(201).json({
                    message:"serviceMan registered",
                    type:"success"
                })
            }



            
        }
    
    }catch(err){
        console.log(err)
    }
})

// handle getRequest

router.get("/serviceManRegister" ,async(req,res)=>{
    try{
     const serviceMan=  await serviceMancoll.find()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get userManRegistered 
router.get("/userRegistered" ,async(req,res)=>{
    try{
     const users=  await userCollection.find()
      res.status(200).json(users)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get contact message
router.get("/contactMessage" ,async(req,res)=>{
    try{
     const users=  await contactCollection.find()
      res.status(200).json(users)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success",

        })
    }
})

// get count of total seervice-man

router.get("/serviceManCount",async(req,res)=>{
    try{
     const serviceMan=  await serviceMancoll.count()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success"
        })
    }
})



// get count of total seervice-man

router.get("/userCount",async(req,res)=>{
    try{
     const serviceMan=  await userCollection.count()
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json({
            message:"success",
            type:"success"
        })
    }
})



// handle individula get request for serviceman
// router.get("/serviceManRegister/:id", async(req,res)=>{
//     try{
//         const _id=req.params.id
       
//      const serviceMan=  await serviceMancoll.findById(_id)
//       res.status(200).json(serviceMan)
//     }catch(err){
//         res.status(404).json(err)
//     }
// })

// handle individula get request for serviceman
router.get("/serviceManRegister/:id",auth, async(req,res)=>{
    try{
        const _id=req.params.id
       
     const serviceMan=  await serviceMancoll.findById(_id)
     if(req.auth){

         res.status(200).json(serviceMan)
     }
     else{
        res.json({
          auth:false  
        })
     }
    }catch(err){
        res.status(404).json(err)
    }
})



// handle category-wise get request for serviceman
router.get("/serviceCategory/:skill",async(req,res)=>{
    try{
        const skill=req.params.skill
        
     const serviceMan=  await serviceMancoll.find({skill:skill})
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json(err)
    }
    

})
// handle location-wise get request for serviceman
router.get("/locationCategory/:city",async(req,res)=>{
    try{
        const city=req.params.city
 
     const serviceMan=  await serviceMancoll.find({city:city})
      res.status(200).json(serviceMan)
    }catch(err){
        res.status(404).json(err)
    }
    

})

// handle location and skill request combinly





// admin auth
router.get("/adminPage",auth, async(req,res)=>{
    try{
     if(req.auth){

         res.status(200).json({
            auth:true
         })
     }
     else{
        res.json({
          auth:false  
        })
     }
    }catch(err){
        res.status(404).json(err)
    }
})

// handle delete request
router.delete("/serviceManRegister/:id",async(req,res)=>{
    try{
        const _id=req.params.id
     const serviceMan=  await serviceMancoll.findByIdAndDelete(_id)
        await cloudinary.uploader.destroy(serviceMan.cloudinary_id)
      res.status(200).json({
        message:"removed successfully",
        type:"success"
      })
    }catch(err){
        res.status(404).json(err)
    }
})

// handle userdelete request
router.delete("/userRegistered/:id",async(req,res)=>{
    try{
       const _id=req.params.id
      
       const user=await userCollection.findByIdAndDelete(_id)
       
       res.status(200).json({
        message:"removed successfully",
        type:"success"
       })
    }catch(err){
        res.status(404).json(err);
    }
})

// handle update request
router.patch("/serviceManRegister/:id", upload.single('image'), async(req,res)=>{
    try{
        const _id=req.params.id
        const {name,userName,email,skill,city,profile_pic,cloudinary_id,text,password}=req.body 
        const serviceMan=  await serviceMancoll.findById(_id)
        await cloudinary.uploader.destroy(serviceMan.cloudinary_id)
        const result= await cloudinary.uploader.upload(req.file.path);

        const data={
            name:name,
            userName:userName,
            email:email,
            skill:skill,
            city:city,
            profile_pic:result.secure_url,
            cloudinary_id:result.public_id,
            text:text,
            password:password
        }
        const updatedData=await serviceMancoll.findByIdAndUpdate(_id,data,{new:true})

      res.status(201).json(updatedData)
    }catch(err){
        res.status(404).json(err)
    }
})
// handle feedback request
router.patch("/serviceManRegisterFeedback/:id", async(req,res)=>{
    try{
        const _id=req.params.id
        const {name,userName}=req.body 
        const serviceMan=  await serviceMancoll.findById(_id)
       

        const updatedData=await serviceMancoll.findByIdAndUpdate(_id,{$push:{feedbacks:{name:name,comment:userName}}})

      res.status(201).json(updatedData)
    }catch(err){
        res.status(404).json(err)
    }
})


router.post("/sendSmsToServiceMan",async(req,res)=>{
    try{

     const {name,message}=req.body;
const client = require('twilio')(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN);


client.messages
  .create({
     body: message,
     from: '+12545406573',
     to: '+916202079108'
   })
  .then(message => console.log(message.sid));

  res.status(201).json({
    message:true,

  })

    }catch(err){
        console.log(err)
    }
})

// user get,and post request handle
router.post("/userRegistration",async(req,res)=>{
    const {name,email,userName,password}=req.body
    try{
   
        
        const users = new userCollection({name:name,userName:userName,email:email,password:password}) 
        const userNameExit=await userCollection.findOne({userName});
        if(userNameExit){
           
            res.status(200).json({message:"userName already exixt",exist:true})
        }
        else{

            const result=  await users.save()
            res.status(201).json({
              message:"user registration successful",
              type:"success"
            })
        }
    }catch(err){
        console.log(err)
    }
})

// admin registration
router.post("/adminRegistration",async(req,res)=>{
    const {name,email,userName,password}=req.body
    try{
      const users = new adminCollection({name:name,userName:userName,email:email,password:password}) 
      const result=  await users.save()
      res.status(201).json({
        message:"admin registration successful",
        type:"success"
      })
    }catch(err){
        console.log(err)
    }
})
// contact handle
router.post("/contactmessage",async(req,res)=>{
    const {name,email,userName}=req.body
    try{
      const users = new contactCollection({name:name,email:email,userName:userName}) 
      const result=  await users.save()
      res.status(201).json({
        message:"user registration successful",
        type:"success"
      })
    }catch(err){
        console.log(err)
    }
})





router.post("/userlogin",async(req,res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;
        const user= await userCollection.findOne({userName:userName})
        if(!user){
          res.json({
            message:"Invalid credentials",
            login:false
          })


        }
        else{
            const  dbPassword=user.password;
            const login= await bcrypt.compare(password,dbPassword)
            if(login){

                const token=  await user.generateAuthToken()
                   res.cookie("userToken",token,{httpOnly:true,sameSite: 'None',path: '/',
                   expires: new Date(new Date().getTime() + 100 * 100000000),secure:true}).json({login:true
                   })
           
            }
            else{
                res.json({
                    message:"Invalid credentials",
                    login:false
                  })
            }
        }
    }catch(err){
        console.log(err)
    }
   

})

// admin login
router.post("/adminlogin",async(req,res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;
        const user= await adminCollection.findOne({userName:userName})
        if(!user){
          res.json({
            message:"Invalid credentials",
            login:false
          })


        }
        else{
            const  dbPassword=user.password;
            const login= await bcrypt.compare(password,dbPassword)
            if(login){

                const token=  await user.generateAuthToken()
                   res.cookie("userToken",token,{httpOnly:true,sameSite: 'None',path: '/',
                   expires: new Date(new Date().getTime() + 100 * 100000000),secure:true}).json({login:true
                   })
           
            }
            else{
                res.json({
                    message:"Invalid credentials",
                    login:false
                  })
            }
        }
    }catch(err){
        console.log(err)
    }
   

})


// router.all("*",(req,res)=>{
//     res.send("<h2>Opps ! page not found<h2/>")
// })

module.exports=router;
