import axios from "axios"

export const addAmbulance = async (payload: any) => {
    try {
        const response = await axios.post('http://localhost:7000/api/add-ambulance', payload);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to add the ambulance');
        }
    }
};

export const getAvailableAmbulances = async () => {
    try {
        return await axios.get('http://localhost:7000/api/get-ambulance')

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to fetch avaialble ambulances')
        }
    }

}

export const addStaff = async (payload: any) => {
    try {
        const response = await axios.post('http://localhost:7000/api/add-staff', payload);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to add the user');
        }
    }
};

export const getAvailableCrewStaff = async () => {
    try {
        return await axios.get('http://localhost:7000/api/get-staff')

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to fetch avaialble crew members')
        }
    }

}


export const logEmergencyCase = async (payload: any) => {
    try {
        const response = await axios.post('http://localhost:7000/api/log-emergency', payload);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to log emergency case')
        }
    }
};

export const updateEmergencyCase = async (payload: any) => {
    try {
        const response = await axios.put('http://localhost:7000/api/update-emergency', payload);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to update emergency case')
        }
    }
};

export const getEmergencyCase = async (currentPage:number) => {
    try {
        const response = await axios.get(`http://localhost:7000/api/get-emergency/?page=${currentPage}&limit=4`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to log emergency case')
        }
    }
};




