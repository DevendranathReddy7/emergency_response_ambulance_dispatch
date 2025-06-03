import { NextFunction, Request, Response } from "express";
import ambulance from "../models/ambulance";

export const addAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newAmbulance = await new ambulance({
            ...req.body
        })

        await newAmbulance.save()
        res.status(201).json({ message: 'Ambulance added sucessfullly' })
    } catch (e: any) {
        res.status(500).json({ message: 'Failed to add a new ambulance due to a server error.', error: e.message });

    }
}

export const getAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableAmbulance = await ambulance.find({ status: 'Available' });
        res.status(200).json({ data: availableAmbulance })
    } catch (e) {
        console.error("Error fetching available ambulances:", e);
        return res.status(400).json({ error: 'Something went wrong while getting available Ambulance details' });

    }

}