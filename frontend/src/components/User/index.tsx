import { Grid } from "@mui/material"
import Input from "../../common/components/Input"
import { useEffect, useReducer, useState, type ChangeEvent, type FormEvent } from "react"
import DropDown from "../../common/components/Dropdown"
import { gender, roles, shiftType } from "../../common/constants/constants"
import type { UserState } from "../../dataModals/Common"
import MuiButton from "../../common/components/MuiButton"
import { useMutation } from "@tanstack/react-query"
import { addStaff, editStaff } from "../../common/services/api"
import Loader from "../../common/components/Loader"
import { toast } from 'react-toastify';
import { useLocation, useParams } from "react-router-dom"
import ShowBanner from "../../common/components/ShowBanner"

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
    shiftType: 'Morning'
};

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.name]: action.value };
        case 'UPDATE_BY_EDIT':
            return { ...state, ...action.payload };
        case "RESET":
            return { ...initialState }
        default:
            return state;
    }
};

const AddUser = () => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [noChangeError, setNoChangeError] = useState<boolean>(false)
    const [response, setResponse] = useState({ userId: '', email: '', generatedPassword: "" })
    const location = useLocation()
    const { id: editingUserId } = useParams()
    const { mode = 'add', formData = {} } = location.state || {}

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
        },
        shiftType: {
            error: false,
            message: 'Shift Type is Required'
        }
    })

    useEffect(() => {
        if (mode === 'add') {
            dispatch({ type: 'RESET' })
        }
    }, [mode])

    useEffect(() => {
        setTimeout(() => {
            setResponse({ userId: '', email: '', generatedPassword: "" })
        }, 20000)
    }, [response])

    useEffect(() => {
        if (mode === 'edit' && formData) {
            dispatch({ type: 'UPDATE_BY_EDIT', payload: formData })
        }
    }, [mode, formData])

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNoChangeError(false)
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

    const { mutate: addMutate, reset: addReset, isPending: addpending } = useMutation({
        mutationFn: (payload) => addStaff(payload),
        onSuccess: (data) => {
            dispatch({ type: 'RESET' })
            toast.success('User added succsufully')
            setResponse(data.data)
            addReset();
        },
        onError: (err) => {
            toast.error(`Failed to add the user: ${err.message}`)
        },
    })

    const { mutate: editMutate, reset: editReset, isPending: editpending } = useMutation({
        mutationFn: (payload) => editStaff(payload),
        onSuccess: () => {
            dispatch({ type: 'RESET' })
            toast.success('User updated succsufully')
            editReset();
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
            if (state.mobile.length !== 10) {
                newErrors.mobile = { error: true, message: 'Mobile number should contain exactly 10 digits' };
                isValid = false;
            } else {
                newErrors.mobile.error = false;

            }
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

        if (mode === 'edit' && !state.shiftType) {
            newErrors.shiftType = { error: true, message: 'Shift type is Required' };
            isValid = false;
        } else {
            newErrors.shiftType.error = false;

        }

        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validateUIFields()
        if (isValid) {
            if (mode === 'add') {
                addMutate(state)
            } else if (mode === 'edit') {
                function areObjectsEqualByStringify(formData: any, updatedData: any) {
                    const keys = Object.keys(formData)
                    for (let key of keys) {
                        if (updatedData[key] !== formData[key]) {
                            return false;
                        }
                    }
                    return true;
                }
                if (!areObjectsEqualByStringify(formData, state)) {
                    editMutate({ ...state, editingUserId })
                } else {
                    setNoChangeError(true)
                }
            }
        }
    }

    return (
        <div className="rounded-lg p-6 shadow-md m-3 bg-white">
            {(addpending || editpending) && <Loader size={40} thickness={4} fullScreen={false} msg="Please wait while we\'re Loading" />}
            {response.email && <ShowBanner type='info' msg={`Please use ${response.email} as EMAIL and ${response.generatedPassword} as PASSWORD to Log into application.`} />}
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Add an User</h2>
            {noChangeError && <ShowBanner type='error' msg="It looks like no details were changed. To update the user, please make some modifications." />}
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

                    {mode === 'edit' && <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <DropDown
                            fieldName="Shift Type"
                            name="shift_type"
                            menuItems={shiftType}
                            value={state.shift_type}
                            selectHandle={selectHandler}
                            error={errors.shiftType?.error}
                            helperText={errors.shiftType?.message}
                        />
                    </Grid>}
                </Grid>

                <div className="flex justify-end mx-6">
                    <MuiButton btnType='submit' variant="contained">{mode === 'edit' ? 'Edit' : 'Add'} user</MuiButton>

                </div>
            </form>
        </div>
    )
}

export default AddUser