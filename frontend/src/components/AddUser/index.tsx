import { Grid } from "@mui/material"
import Input from "../../common/components/Input"
import { useReducer, useState, type ChangeEvent } from "react"
import DropDown from "../../common/components/Dropdown"
import { gender, roles } from "../../common/constants/constants"
import type { UserState } from "../../dataModals/Common"
import MuiButton from "../../common/components/MuiButton"

// type UserAction =
//     | { type: "UPDATE_FIELD"; name: keyof UserState; value: any };

const initialState: UserState = {
    name: "",
    email: "",
    gender: "",
    mobile: "",
    address: "",
    role: "",
    age: "",
};

const reducer = (state: UserState, action:any): UserState => {
    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.name]: action.value };
        default:
            return state;
    }
};

const AddUser = () => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [errors, setErrors] = useState({
        name: {
            error: false,
            message: 'Name is Required'
        },
        age: {
            error: false,
            message: 'Age is Required'
        },
        email: {
            error: false,
            message: 'Email id is Required'
        },
        gender: {
            error: false,
            message: 'gender is Required'
        },
        mobile: {
            error: false,
            message: 'Mobile number is Required'
        },
        role: {
            error: false,
            message: 'Role is Required'
        },
        address: {
            error: false,
            message: 'Address is Required'
        }
    })

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name,value)
        dispatch({ type: "UPDATE_FIELD", name: name as keyof UserState, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors, error: false }
        }));
    };

    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const {name,value} = e.target
        dispatch({ type: "UPDATE_FIELD", name, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors[name as keyof typeof prevErrors], error: false, message: prevErrors[name as keyof typeof prevErrors].message }
        }));
    };

    return (
        <div className="bg-gray-200 p-3 rounded m-3">
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Add an User</h2>
            <form>
                <Grid container spacing={3} margin={3}>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Name"
                            name="name"
                            changeHandle={changeHandler}
                            value={state.name}
                            id="name"
                            datatestid="name"
                        // error={errors.name?.error}
                        // helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <DropDown
                            fieldName="Gender"
                            name="gender"
                            menuItems={gender}
                            value={state.gender}
                            selectHandle={selectHandler}
                            error={errors.gender?.error}
                            helperText={errors.gender?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <DropDown
                            fieldName="Role"
                            name="role"
                            menuItems={roles}
                            value={state.role}
                            selectHandle={selectHandler}
                            error={errors.role?.error}
                            helperText={errors.role?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="E-mail"
                            name="email"
                            changeHandle={changeHandler}
                            value={state.email}
                            id="email"
                            datatestid="email"
                            error={errors.name?.error}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Age"
                            name="age"
                            changeHandle={changeHandler}
                            value={state.age}
                            id="age"
                            datatestid="age"
                            error={errors.age?.error}
                            helperText={errors.age?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Mobile"
                            name="mobile"
                            changeHandle={changeHandler}
                            value={state.mobile}
                            id="mobile"
                            datatestid="mobile"
                            error={errors.name?.error}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Address"
                            name="address"
                            changeHandle={changeHandler}
                            value={state.address}
                            id="address"
                            datatestid="address"
                            error={errors.name?.error}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                </Grid>

                <div className="flex justify-end mx-6">
                    <MuiButton btnType='submit' variant="contained">Add user</MuiButton>

                </div>
            </form>
        </div>
    )
}

export default AddUser