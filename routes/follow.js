import {Router} from 'express';
import Follow from '../models/Follow.js';

import dotenv from "dotenv";
const router = Router()

dotenv.config()

router.get("/", async (req, res) => {
    // console.log(req.query.id_User)
    const follow = await findOne({ "id_User": `${req.query.id_User}` }).sort({ registration_data: -1 }).limit(1).catch(error => {
        return res.status(400).json({ msg: 'Dont connect or error user' })
    })
    if (!follow) {
        return res.status(400).json({ msg: 'Dont connect or error user' })
    }
    return res.status(200).json({ follow })
})

export default router;