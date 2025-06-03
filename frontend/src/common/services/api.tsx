import axios from "axios"

export const getAvailableAmbulances = async () => {
    try {
        return await axios.get('http://localhost:7000/api/get-ambulance')

    } catch (e) {

    }

}

export const getAvailableCrewStaff = async () => {
    try {
        return await axios.get('http://localhost:7000/api/get-crewMembers')

    } catch (e) {

    }

}


export const logEmergencyCase = async(payload:any) => {
    try {
        const response = await axios.post('http://localhost:7000/api/logEmergency',payload
        );
        return response.data;
    } catch (error: any) {
        console.error('Error logging emergency case:', error);
        return { success: false, error: error.message || 'Failed to log emergency case' };
    }
};