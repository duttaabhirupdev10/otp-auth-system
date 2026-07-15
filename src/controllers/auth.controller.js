import userModel from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        // if the user name andd email already exists in the database then return error
        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isAlreadyRegistered) {
            return res.status(409).send("User already registered");
        }

        const hasedPassword = crypto.createHash('sha256').update(password).digest('hex');
        /*
    Step-by-step explanation
        crypto.createHash('sha256')
            Creates a hash object using the SHA-256 algorithm.
        .update(password)
            Feeds the password string into the hash function.
        .digest('hex')
            Finalizes the hash and returns it as a hexadecimal string.
        */
        const user = new userModel({
            username,
            email,
            password: hasedPassword
        });
        await user.save();
        // Handle registration logic here
        res.send("User registered successfully");
    } catch (error) {
        res.status(500).send("Error registering user");
    }

    const token=jwt.sign({ username, email }, config.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User registered successfully', user: { username, email }, token });
}