import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { // <-- Uses the new variable
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // You may need to remove deprecated options like useCreateIndex and useFindAndModify
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;