import mongoose from 'mongoose';

const connectToDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const mongoURI = process.env.MONGODB_URI;
        if (typeof mongoURI === 'undefined') {
            console.error('MongoUri env variable is not defined');
            process.exit(1);
        }

        try {
            await mongoose.connect(mongoURI);
            console.log('Connected to database');
        } catch (error) {
            console.error('Could not connect to database', error);
            process.exit(1);
        }
    }
};

export default connectToDB;