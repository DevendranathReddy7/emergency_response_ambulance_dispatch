import { Grid } from "@mui/material"
import Input from "../../common/components/Input"
import { useReducer, useState, type ChangeEvent, type FormEvent } from "react"
import DropDown from "../../common/components/Dropdown"
import { gender, roles } from "../../common/constants/constants"
import type { UserState } from "../../dataModals/Common"
import MuiButton from "../../common/components/MuiButton"
import { useMutation } from "@tanstack/react-query"
import { addStaff } from "../../common/services/api"
import Loader from "../../common/components/Loader"
import { toast } from 'react-toastify';

// type UserAction =
//     | { type: "UPDATE_FIELD"; name: keyof UserState; value: any };

const initialState = {
    name: "",
    email: "",
    gender: "",
    mobile: "",
    address: "",
    role: "",
    age: "",
};

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.name]: action.value };
        case "RESET":
            return { ...initialState }
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
        if (name === 'mobile' && !(/^[0-9]+$/.test(value))) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: { message: 'Please enter numbers only', error: true }
            }));
        } else {
            dispatch({ type: "UPDATE_FIELD", name: name as keyof UserState, value });
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: { ...prevErrors, error: false }
            }));
        }

    };

    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        dispatch({ type: "UPDATE_FIELD", name, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors[name as keyof typeof prevErrors], error: false, message: prevErrors[name as keyof typeof prevErrors].message }
        }));
    };

    const { mutate, reset, isPending } = useMutation({
        mutationFn: (payload) => addStaff(payload),
        onSuccess: () => {
            dispatch({ type: 'RESET' })
            toast.success('User added succsufully')
            reset();
        },
        onError: (err) => {
            toast.error(`Failed to add the user: ${err.message}`)
        },
    })

    const validateUIFields = () => {

        let isValid = true;
        const newErrors = { ...errors };

        if (!state.name || state.name.length < 3) {
            newErrors.name = { error: true, message: 'Name must be at least 3 characters long' };
            isValid = false;
        } else {
            newErrors.name.error = false;
        }

        if (!state.age) {
            newErrors.age = { error: true, message: 'Age is Required' };
            isValid = false;
        } else {
            newErrors.age.error = false;
        }

        if (!state.email) {
            newErrors.email = { error: true, message: 'Email ID is Required' };
            isValid = false;
        } else {
            newErrors.email.error = false;
        }

        if (!state.gender) {
            newErrors.gender = { error: true, message: 'Gender is Required' };
            isValid = false;
        } else {
            newErrors.gender.error = false;
        }

        if (!state.mobile) {
            newErrors.mobile = { error: true, message: 'Mobile number is Required' };
            isValid = false;
        } else {
            // might want to add mobile number validation here (e.g., length)
            newErrors.mobile.error = false;
        }

        if (!state.role) {
            newErrors.role = { error: true, message: 'Role is Required' };
            isValid = false;
        } else {
            newErrors.role.error = false;
        }

        if (!state.address) {
            newErrors.address = { error: true, message: 'Address is Required' };
            isValid = false;
        } else {
            newErrors.address.error = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validateUIFields()
        if (isValid) {
            mutate(state)
        }
    }
    return (
        <div className="bg-gray-200 p-3 rounded m-3">
            {isPending && <Loader />}
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Add an User</h2>
            <form onSubmit={submitHandler}>
                <Grid container spacing={3} margin={3}>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Name"
                            name="name"
                            changeHandle={changeHandler}
                            value={state.name}
                            id="name"
                            datatestid="name"
                            error={errors.name?.error}
                            helperText={errors.name?.message}
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
                            error={errors.email?.error}
                            helperText={errors.email?.message}
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
                            error={errors.mobile?.error}
                            helperText={errors.mobile?.message}
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
                            error={errors.address?.error}
                            helperText={errors.address?.message}
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