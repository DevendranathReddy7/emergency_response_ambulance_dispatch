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