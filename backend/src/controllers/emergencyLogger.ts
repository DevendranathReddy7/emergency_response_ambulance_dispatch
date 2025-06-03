import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";
import { priorityLevel } from "../common/constants";
import ambulanceAllocation from "../models/ambulance";

const emergencyLogger = async (req: Request, res: Response, next: NextFunction) => {
    const { priority, ambulanceId, crewMembers } = req.body;
    const staffMongoId = crewMembers.map(async (staff: string) => {
        const parts = staff.split('-');
        const email = parts[1]?.trim();
        if (email) {
            try {
                const userResult = await user.findOne({ email, role: { $ne: 'Patient' } });
                return userResult;
            } catch (error) {
                console.error(`Error finding user with emailId ${email}:`, error);
                return null;
            }
        }
    });

    const staffUsers = await Promise.all(staffMongoId);

    try {
        if (!priority || !priorityLevel.includes(priority)) {
            return res.status(400).json({ error: 'Priority is required and must be a value from 1 (Highest) to 5 (Lowest).' });
        }

        if (!ambulanceId) {
            return res.status(400).json({ error: 'Ambulance assignment is required for this case.' });
        }

        const ambulanceMongoObj = await ambulanceAllocation.findOne({ vehicleNumber: ambulanceId }).select('_id').lean();
        let ambulanceMongoId
        if (ambulanceMongoObj) {
            ambulanceMongoId = ambulanceMongoObj._id;
        }
        //  else {
        //     console.log("Ambulance with vehicle number", ambulanceId, "not found.");
        // }

        if (!crewMembers) {
            return res.status(400).json({ error: 'Please assign the staff members to this case.' });
        }

        const newCase = await new emergencyCase({
            //@ts-ignore
            ...req.body, ambulanceId: ambulanceMongoId, crewMembers:staffUsers._id 
        });

        await newCase.save();
        res.status(201).json({ message: 'Case Logged Successfully', data: newCase.crewMembers });

    } catch (e: any) {
        res.status(500).json({ message: 'Failed to log emergency case due to a server error.', error: e.message });
    }
}

export default emergencyLogger;