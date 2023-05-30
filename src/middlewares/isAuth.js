//import config from '../config.env'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config();

function isAuth(req, res, next){
   

    // const token=req.header("photome-token")
    const token =
    req.headers.authorization == null
      ? null
      : req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({msg:"No token found"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.PhoToUser = decoded;
        next()
    } catch(err){
        return res.status(400).json({msg:"Token is invalid"})
    }
}
export default isAuth;