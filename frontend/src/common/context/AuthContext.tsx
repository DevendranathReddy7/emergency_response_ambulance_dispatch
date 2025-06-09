import { createContext, useState } from 'react';

export const AuthContext = createContext('');
//@ts-ignore
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    //@ts-ignore
    const userLogin = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
    };

    return (
        //@ts-ignore
        <AuthContext.Provider value={{ token, userLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
