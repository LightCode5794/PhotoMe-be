import express from 'express';
import Newfeed from '../app/models/Newfeed.js'
import User from '../app/models/User.js'
import Profile from '../app/models/Profile.js'
import Comment from '../app/models/Comment.js'
import Liked from '../app/models/Liked.js'

import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const router = express.Router()

dotenv.config()

export const a = async (req, res) => {
    const { id_User, status, image } = req.body

    if (!id_User || !image) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Profile.findOne({ id_User: id_User }).then(async user => {
        if (!user) return res.status(400).json({ msg: 'Profile not found' })
        const newNewfeed = new Newfeed({ id_User, image, status })
        newNewfeed.save().then(async newfeed => {
            await Profile.findOne({ id_User: id_User }).then(async pfile => {
                await Profile.updateOne({ _id: pfile.id }, {
                    $set: {
                        "post": pfile.post + 1,
                    }
                })
                    .then(() => {
                        return res.status(200).json({ msg: 'Success', newfeed })
                    })
                    .catch(() => {
                        return res.status(400).json({ msg: 'Update post profile fail' })
                    })
            })
        })
    }).catch(err => { return res.status(400).json({ msg: 'Profile not found' }) })
}