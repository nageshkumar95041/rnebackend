const jwt=require("jsonwebtoken");
const token =jwt.sign({id:"43455456rfgfgf"},"dklfdfjdlfje3409404930933430iddff");
console.log(token)
const verify=jwt.verify(null,"dklfdfjdlfje3409404930933430iddff",(err));
console.log(verify)