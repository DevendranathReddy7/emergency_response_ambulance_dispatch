import { NextFunction, Request, Response } from "express";
import user from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const foundUser = await user.findOne({ email, role: { $ne: 'Patient' } });

        if (!foundUser) {
            return res.status(401).json({ message: "Invalid credentials (email not found or role restricted)" });
        }
        const storedHashedPassword = foundUser.password
        //@ts-ignore
        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (incorrect password)" });
        }


        const { password: userPassword, ...userInfo } = foundUser.toObject();

        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role, email: foundUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: userInfo,
        });

    } catch (err: any) {
        console.error("Login error:", err);
        res.status(500).json({ message: "An unexpected error occurred during login." });
    }
};

export default Login;
