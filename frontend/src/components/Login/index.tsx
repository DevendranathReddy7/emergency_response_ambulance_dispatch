import { Grid } from "@mui/material"
import Input from "../../common/components/Input"
import { useReducer, useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginState } from "../../dataModals/Common";
import MuiButton from "../../common/components/MuiButton";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../common/services/api";
import { toast } from "react-toastify";
import Loader from "../../common/components/Loader";
import { useNavigate } from "react-router-dom";
import { loginError, loginRequest, loginSuccess } from "../../store/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
    email: '',
    password: ''
}

const reducer = (state: any, action: any) => {

    switch (action.type) {
        case "UPDATE_FIELD":
            return { ...state, [action.name]: action.value };
        default:
            return { ...state }
    }
}

const Login = () => {
    const navigate = useNavigate()
    const dispatchToStore = useDispatch()
    const { loading, error, userData } = useSelector((state: any) => state.auth)
    const [errors, setErrors] = useState({
        email: {
            error: false,
            message: 'Email id is Required'
        },

        password: {
            error: false,
            message: 'Password is Required'
        }
    })

    const [state, dispatch] = useReducer(reducer, initialState)

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        dispatch({ type: "UPDATE_FIELD", name: name as keyof LoginState, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors, error: false }
        }));


    };

    const validateUiFields = () => {

        let isValid = true;
        const newErrors = { ...errors };

        if (!state.email) {
            newErrors.email = { error: true, message: 'Email is Required' };
            isValid = false;
        } else {
            newErrors.email.error = false;
        }

        if (!state.password) {
            newErrors.password = { error: true, message: 'Password is Required' };
            isValid = false;
        } else {
            newErrors.password.error = false;
        }
        setErrors(newErrors);
        return isValid
    }

    const { mutate, reset } = useMutation({
        mutationFn: (payload) => login(payload),
        onSuccess: (data: any) => {
            dispatchToStore(loginSuccess(data))            
            toast.success('Welcome Back!')
            navigate('/')
            reset()
        },
        onError: (data) => {
            dispatchToStore(loginError(data))
            toast.error(data.message)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validateUiFields()
        if (isValid) {
            dispatchToStore(loginRequest())
            mutate(state)
        }

    }
    return (
        <Grid container alignItems={'center'} justifyContent={"center"} className={'min-h-screen'}>
            <Grid size={{ xs: 8, md: 5 }} className={'shadow-md rounded-lg p-6'}>
                {loading && <Loader thickness={4} size={40} fullScreen={false} msg="Please wait while we verify you" />}
                <h1 className="text-center font-bold text-xl">Login</h1>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} margin={3}>
                        <Grid size={{ xs: 12 }}>
                            <Input
                                label="Email"
                                name="email"
                                changeHandle={changeHandler}
                                value={state.email}
                                id="email"
                                datatestid="email"
                                error={errors.email?.error}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Input
                                label="Password"
                                name="password"
                                changeHandle={changeHandler}
                                value={state.password}
                                id="password"
                                datatestid="password"
                                error={errors.password?.error}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                    </Grid>

                    <div className="flex justify-end mx-6">
                        <MuiButton btnType='submit' variant="contained">Log-in</MuiButton>

                    </div>
                </form>
            </Grid>
        </Grid>

    )
}

export default Login