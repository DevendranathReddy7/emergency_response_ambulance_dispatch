import { NextFunction, Request, Response } from "express";
import ambulance from "../models/ambulance";
import mongoose from "mongoose";

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
    const { type } = req.query
    let query: any = {}

    if (type === 'Available') {
        query.status = 'Available'
    }
    try {
        const availableAmbulance = await ambulance.find(query).sort({ name: 1 });
        res.status(200).json({ data: availableAmbulance })
    } catch (e) {
        console.error("Error fetching available ambulances:", e);
        return res.status(400).json({ error: 'Something went wrong while getting available Ambulance details' });

    }
}

export const deleteAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ambulanceId } = req.query; 

        if (!ambulanceId) {
            return res.status(400).json({ message: 'Ambulance ID is required for deletion.' });
        }

        if (!mongoose.Types.ObjectId.isValid(ambulanceId as string)) {
            return res.status(400).json({ message: 'Invalid Ambulance ID format.' });
        }

        const ambulanceToDelete = await ambulance.findById(ambulanceId as string);

        if (!ambulanceToDelete) {
            return res.status(404).json({ message: 'Ambulance not found.' });
        }

        if (ambulanceToDelete.status !== 'Available') {
            return res.status(400).json({
                message: `Ambulance "${ambulanceToDelete.vehicleNumber}" cannot be deleted because its current status is "${ambulanceToDelete.status}". Only 'Available' ambulances can be deleted.`,
            });
        }

        await ambulance.findByIdAndDelete(ambulanceId as string);

        res.status(200).json({ message: 'Ambulance deleted successfully.', deletedAmbulanceId: ambulanceToDelete._id });

    } catch (e: any) {
        console.error('Error deleting ambulance:', e);
        res.status(500).json({ message: 'Failed to delete ambulance due to a server error. Please try again later.', error: e.message });
    }
};