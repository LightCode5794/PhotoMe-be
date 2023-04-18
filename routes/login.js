import express from 'express';
import User from '../models/User.js';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
const router = express.Router();
import auth from "../middlewares/auth.js"

dotenv.config()

router.post("/", (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ err: 'Enter all fields' })
    }
    User.findOne({ email }).then(user => {
        if (!user)
            return res.status(400).json({ msg: 'Email or Password incorrect' })
        bcryptjs.compare(password, user.password).then((isMatch) => {
            if (!isMatch)
                return res.status(400).json({ msg: 'Invalid credentials' })
            jwt.sign({ id: user.id }, process.env.secret, { expiresIn: "1000d" }, (err, token) => {
                if (err)
                    throw err
                res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                })
            })
        })
    })
    //
    // console.log(`Login success! ${req.body}`)
})

router.get("/user", auth, (req, res) => {
    User.findById(req.PhoToUser.id)
        .select("-password")
        .then((user) => res.status(200).json(user))
})

export default router;
