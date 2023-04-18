import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connect successfully!!!');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

export default connectDB;