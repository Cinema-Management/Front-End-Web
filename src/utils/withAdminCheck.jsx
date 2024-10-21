import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Middleware kiểm tra quyền truy cập
const withAdminCheck = (Component) => {
    return (props) => {
        const user = useSelector((state) => state.auth.login?.currentUser);
        if (user?.isAdmin) {
            return <Component {...props} />;
        } else {
            return <Navigate to="/" />;
        }
    };
};
export default withAdminCheck;
