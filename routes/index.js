
import express from 'express';

import userRoutes from './user.js';
import loginRoutes from './login.js';
import accountRoutes from './account.js';
import profileRoutes from './profile.js';
import newfeedRoutes from './newfeed.js';
import likedRoutes from './liked.js';
import commentRoutes from './comment.js';
import followRoutes from './follow.js';



const router = express.Router();

router.use('/test', (req, res) => {
    res.send('ahihi');
})
router.use('/user', userRoutes)
router.use('/login', loginRoutes)
router.use('/account', accountRoutes)
router.use('/profile', profileRoutes)
router.use('/newfeed', newfeedRoutes)
router.use('/liked', likedRoutes)
router.use('/comment', commentRoutes)
router.use('/follow', followRoutes)

export default router;
