import { createSlice } from "@reduxjs/toolkit"

interface loginData {
    loading: boolean,
    error: null | boolean,
    userData: null | {
        token: string,
        message: string,
        user: {
            address: string,
            age: string,
            createdAt: string,
            email: string,
            fatigueLevel: number,
            gender: string,
            mobile: string,
            name: string,
            role: string,
            shiftType: string,
            status: string,
            updatedAt: string,
            __v: 0
            _id: string
        }
    }
}

const initialState: loginData = {
    loading: false,
    error: null,
    userData: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false,
                state.userData = action.payload,
                state.error = null
        },
        loginError: (state, action) => {
            state.loading = false,
                state.userData = null,
                state.error = true
        }
    }
})

export const { loginRequest, loginSuccess, loginError } = authSlice.actions
export default authSlice.reducer