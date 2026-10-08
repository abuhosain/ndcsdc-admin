const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    console.log(allowedRoles);

    return <>{children}</>;
};

export default ProtectedRoute;