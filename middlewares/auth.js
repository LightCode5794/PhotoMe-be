//import config from '../config.env'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

function auth(req,res,next){
    dotenv.config()

    const token=req.header("photome-token")

    if(!token){
        return res.status(401).json({msg:"No token found"})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.PhoToUser=decoded
        next()
    } catch(err){
        res.status(400).json({msg:"Token is invalid"})
    }
}
export default auth