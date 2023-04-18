
import express from 'express';
import dotenv from 'dotenv';
//import corsConfig from './configs/cors.js';
//import connectDB from './configs/db.js';
//import route from './routes/index.js';
//import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
//connectDB();

// app
const app = express();
app.use(express.json());
app.use(express.urlencoded({  extended: false}));
//app.use(corsConfig);

// routes
//app.use('/api', route);
app.get('/', (req, res) => {
    res.send('<h1>Welcome to PhotoMe App</h1>');
});

//app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

//const mongoose = require('mongoose')

// const PORT = process.env.PORT || 5000
// dotenv.config({ path: "./config.env" })

// mongoose.connect(process.env.mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
// })

// mongoose.connection.on("connected", () => {
//     console.log("Connected to DB")
// })

// mongoose.connection.on("error", (err) => {
//     console.log("error", err)
// })

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// app.use('/api/user', require("./router/user"))
// app.use('/api/login', require("./router/login"))
// app.use('/api/account', require("./router/account")) // Minh test
// app.use('/api/profile', require("./router/profile"))
// app.use('/api/newfeed', require("./router/newfeed"))
// app.use('/api/liked', require("./router/liked"))
// app.use('/api/comment', require("./router/comment"))
// app.use('/api/follow', require("./router/follow"))

// app.get('/', (req, res) => {
//     res.send("Welcome to PhotoMe App")
// })

// app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`)
// })
