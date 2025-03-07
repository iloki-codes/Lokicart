import { Navigate, Outlet } from "react-router-dom";
import { Props } from "../types/types";


const safeRoute = ( { 
    isAuthenticated, 
    children, 
    adminRoute, 
    isAdmin, 
    redirect = "/" 
}: Props ) => {

    if (!isAuthenticated)
        return <Navigate to={redirect} />

    if(adminRoute && !isAdmin)
        return <Navigate to={redirect} />

    return children ? children : <Outlet />;
};

export default safeRoute;