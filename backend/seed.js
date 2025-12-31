import bcrypt from 'bcrypt';
import User from "./models/User.js";
import connectDB from './db/connection.js'; 

const register = async () => {
    try {
        connectDB();
        const hashPasswaord = await bcrypt.hash('admin', 10);
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPasswaord,
            address: "admin address",
            role:'admin'
        }) 
        await newUser.save();
        console.log("Admin user created successfully");
    }
    catch (error) {
        console.log("Creation error:", error.message);
    }
}

register();