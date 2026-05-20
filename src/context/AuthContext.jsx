import { createContext, useReducer, useEffect, useContext } from "react";
import api from "@/config/api";

const AuthContext = createContext();

const initialState = { isAuth: false, user: null, loading: true };

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isAuth: true, user: action.payload, loading: false };
        case 'LOGOUT':
            return { ...initialState, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const readProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch({ type: 'LOGOUT' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const res = await api.get("/auth/profile");

            const { user } = res.data;

            if (res.status === 200) {
                dispatch({ type: 'LOGIN', payload: user });
                console.log("Fetched User:", user);
            }
        }
        catch (error) {
            console.error("Auth Error:", error.response?.data?.message || error.message);
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    useEffect(() => { readProfile(); }, []);

    return (

        <AuthContext.Provider value={{ ...state, dispatch, readProfile, handleLogout }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);