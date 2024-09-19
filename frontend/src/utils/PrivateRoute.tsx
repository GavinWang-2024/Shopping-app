import {useContext} from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


const PrivateRoutes: React.FC = () => {
    const auth=useContext(AuthContext)
    if(!auth)throw new Error("AuthContext must be used within AuthProvider");
    return (auth.user?<Outlet/>:<Navigate to="/login"/>);
};
export default PrivateRoutes