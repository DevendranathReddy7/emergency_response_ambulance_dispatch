import { NextFunction, Request, Response } from "express";
import user from "../models/user";
import { roles, staffRoles } from "../common/constants";

export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, role,  mobile  } = req.body;

    try {
        if (!email && staffRoles.includes(role)) {
            return res.status(400).json({ error: 'Please enter the email' });
        }

        const isEmailExisted = await user.findOne({ email });
        if (isEmailExisted) {
            return res.status(400).json({ error: 'Entered email is already present' });
        }
        if (email.includes('-')) {
            return res.status(400).json({ error: 'Please remove hypens\'s (-) from the emailId' });
        }

        if (name.length < 4) {
            return res.status(400).json({ error: 'Name should contains atleast 3 character length' });
        }

        if (!roles.includes(role)) {
            return res.status(400).json({ error: 'Role can be only one of Admin, Emergency response staff, Triage staff, Patient' });
        }

        if (!mobile) {
            return res.status(400).json({ error: 'Staff mobile number is required' });
        }

        const newUserObject = await new user({
            ...req.body
        })

        if (!staffRoles.includes(role)) {
            newUserObject.password = name.slice(0, 4) + Math.floor(Math.random() * 1000)
        }

        await newUserObject.save();
        res.status(201).json({ message: 'Staff added successfully', data: newUserObject?.password });
    } catch (e: any) {
        res.status(500).json({ message: 'Failed to add the memeber due to a server error. Please try again later', error: e.message });
    }
};

export const getCrewMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableCrewMembers = await user.find({ role: 'Emergency response staff', status: "Active" })
        res.status(200).json({ data: availableCrewMembers })
    } catch (e: any) {
        res.status(500).json({ message: 'Failed to retrive available crew members. Please try again later', error: e.message });

    }
}