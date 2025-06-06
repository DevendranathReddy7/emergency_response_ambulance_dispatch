import { NextFunction, Request, Response } from "express";
import ambulance from "../models/ambulance";

export const addAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    const { vehicleNumber } = req.body;

    try {
        const isVehicleNumberExisted = await ambulance.findOne({ vehicleNumber });
        if (isVehicleNumberExisted) {
            return res.status(400).json({ message: 'Failed to add a new ambulance:', error: 'Provided vehicle number is already registered.' });
        } else {
            const newAmbulance = new ambulance({
                ...req.body
            });

            await newAmbulance.save();
            return res.status(201).json({ message: 'Ambulance added successfully' });
        }
    } catch (e: any) {
        return res.status(500).json({ message: 'Failed to add a new ambulance due to a server error.', error: e.message });
    }
};

export const getAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableAmbulance = await ambulance.find({ status: 'Available' });
        res.status(200).json({ data: availableAmbulance })
    } catch (e) {
        console.error("Error fetching available ambulances:", e);
        return res.status(400).json({ error: 'Something went wrong while getting available Ambulance details' });

    }
}