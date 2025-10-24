import express from "express"; 
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createStreamUser, upsertStreamUser } from "../DB/Stream.js";



export async function Signup(req, res, next) {
    try{
        const {FullName, Email, Password} = req.body;
        if(!FullName || !Email || !Password){
            return res.status(400).json({error:"Please fill all the fields"});
        }
        const user = await User.findOne({Email});
        if(user){
            return res.status(400).json({error:"User already exists"});
        }
        if(Password.length < 6){
            return res.status(400).json({error:"Password must be at least 6 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(Email)) {
              return res.status(400).json({ message: "Invalid email format" });
        }

        const idx = Math.floor(Math.random() * 100)+1;
        const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            FullName,
            Email,
            Password,
            profilepic: avatar
        });

        try{
            await createStreamUser({
                id: newUser._id.toString(),
                name: newUser.FullName,
                image: newUser.profilepic || "",
            });

            console.log(`Stream user created successfully for ${newUser.FullName} `);
        }catch(error){
            console.error("Error creating Stream user:", error);
            throw error;
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie("JWT", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({success: true, user:newUser});

    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function Login(req, res) {
    try{
        const { Email, Password} = req.body;
        if(!Email || !Password){
            return res.status(400).json({error:"Please fill all the fields"});
        }
        const user = await User.findOne({Email});
        if(!user){
            return res.status(404).json({error:"Invalid credentials"});
        }
        const comparePassword = await user.comparePassword(Password);
        if(!comparePassword){
            return res.status(400).json({error:"Invalid crediantials"});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie("JWT", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({success: true, user});
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function Logout(req, res) {
    res.clearCookie("JWT");
    res.status(200).json({success: true, message: "User logged out"});
}

export async function onboard(req, res) {
    try{
        const userId = req.user._id;

        const {FullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!FullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"Please fill all the fields",
                missingFields: [
                    !FullName && "FullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            {new: true}
        );

        if(!updatedUser){
            return res.status(404).json({error: "User not found"});
        }

        try{
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.FullName,
                image: updatedUser.profilepic || "",
            });
        }catch(error){
            console.error("Error upserting Stream user:", error);
        }

        res.status(200).json({success: true, user: updatedUser});
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
}