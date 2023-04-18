import express from 'express'
import User from '../models/User.js';
import dotenv from "dotenv"

const router = express.Router()

dotenv.config()

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    User.findById(id, {

    })
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
})

export default router;
