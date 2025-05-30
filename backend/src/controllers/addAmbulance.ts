import { NextFunction, Request, Response } from "express";
import ambulanceAllocation from "../models/ambulanceAllocation";

const addAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newAmbulance = await new ambulanceAllocation({
            ...req.body
        })

        await newAmbulance.save()
        res.status(201).json({ message: 'Ambulance added sucessfullly' })
    } catch (e:any) {
        res.status(500).json({ message: 'Failed to add a new ambulance due to a server error.', error: e.message });

    }
}

export default addAmbulance