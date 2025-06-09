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

export const getAvailableAmbulances = async (query ='Available') => {
    try {
        return await axios.get(`http://localhost:7000/api/get-ambulance?type=${query}`)

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to fetch avaialble ambulances')
        }
    }

}

export const deleteAmbulance = async (ambulanceId:string) => {
    try {
        return await axios.delete(`http://localhost:7000/api/delete-ambulance/?ambulanceId=${ambulanceId}`)

    } catch (error: any) {
        console.log(error)
        if (error.response ) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.message || 'Failed to delete the Ambulance')
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

export const editStaff = async (payload: any) => {
    try {
        const response = await axios.put('http://localhost:7000/api/update-staff', payload);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to add the user');
        }
    }
};

export const getAvailableCrewStaff = async (role = 'erStaff', status = 'active') => {
    try {
        return await axios.get(`http://localhost:7000/api/get-staff/?role=${role}&status=${status}`)

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to fetch avaialble crew members')
        }
    }

}

export const deleteTheUser = async (userId:string) => {
    try {
        return await axios.delete(`http://localhost:7000/api/delete-staff/?userId=${userId}`)

    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message || 'Failed to delete the user')
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

export const getEmergencyCase = async (currentPage: number) => {
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




