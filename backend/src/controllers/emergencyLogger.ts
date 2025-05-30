import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";

const emergencyLogger = async (req: Request, res: Response, next: NextFunction) => {
    const { priority, ambulanceId, crewMembers } = req.body;
    const { staffIds } = crewMembers || {};

    const staffMongoId = staffIds.map(async (staff: string) => {
        const parts = staff.split('-');
        const email = parts[1].trim();
        try {
            const userResult = await user.findOne({ email, role: { $ne: 'Patient' } });
            return userResult;
        } catch (error) {
            console.error(`Error finding user with emailId ${email}:`, error);
            return null;
        }
    });

    const staffUsers = await Promise.all(staffMongoId);

    try {
        if (!priority || !['1', '2', '3', '4', '5'].includes(priority)) {
            return res.status(400).json({ error: 'Priority is required and must be a value from 1 (Highest) to 5 (Lowest).' });
        }

        if (!ambulanceId) {
            return res.status(400).json({ error: 'Ambulance assignment is required for this case.' });
        }

        if (!staffIds || staffIds.length < 1 || staffIds.length > 2) {
            return res.status(400).json({ error: 'Please assign at least one and at most two staff members to this case.' });
        }

        const newCase = await new emergencyCase({
            ...req.body, crewMembers: { ...crewMembers, staffIds: staffUsers }
        });

        await newCase.save();
        res.status(201).json({ message: 'Case Logged Successfully', data: newCase.crewMembers });

    } catch (e: any) {
        res.status(500).json({ message: 'Failed to log emergency case due to a server error.', error: e.message });
    }
}

export default emergencyLogger;