"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDB = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default.connection.asPromise();
    }
    else {
        const mongoURI = process.env.MONGODB_URI;
        if (typeof mongoURI === 'undefined') {
            console.error('MongoUri env variable is not defined');
            process.exit(1);
        }
        try {
            await mongoose_1.default.connect(mongoURI);
            console.log('Connected to database');
        }
        catch (error) {
            console.error('Could not connect to database', error);
            process.exit(1);
        }
    }
};
exports.default = connectToDB;
//# sourceMappingURL=dbConnection.js.map