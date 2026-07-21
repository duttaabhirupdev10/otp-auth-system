import userModel from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


export async function register(req, res) {
    try {
        const { username, email, password } = req.body || {};

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({ message: "User already registered" });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '15m' });// jwt.sign -->generates access token


        const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });// jwt.sign -->generates refresh token

// storing refresh token in httpOnly cookie to prevent XSS attacks and secure the token the cookies are at the client side server
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
}



export async function getMe(req, res) {
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }

    const decoded=jwt.verify(token,config.JWT_SECRET);
    const user= await userModel.findById(decoded.id)

    res.status(200).json({
        message:"message retrieved successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })                      
   
}


export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not provided" });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const accessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: '15m' });

        const newRefreshToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: '7d' });
        // store new refresh token in the cookies
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "access token generated successfully",
            accessToken
        });
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token", error: error.message });
    }
}