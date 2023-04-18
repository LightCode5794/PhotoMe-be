import express from 'express';
import User from '../models/User.js';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const router = express.Router()

dotenv.config()


router.post('/', (req, res) => {
    // console.log(req.body)
    const { name, email, password, sex } = req.body;

    if (!name || !email || !password || !sex) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }
    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: 'User Exists' })
        const newUser = new User({
            name,
            email,
            password,
            sex,
        })
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    return res.status(400).json({ msg: "Error hashing a password" })
                newUser.password = hash
                newUser.save().then(user => {
                    jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err
                        return res.status(200).json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                sex: user.sex,
                            },
                        })
                    })
                })
            })
        })
        console.log(req.body)
    })
})

export default  router;
