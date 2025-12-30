import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setToken(token);
            navigate("/student-dashboard"); // Default to student dashboard, AuthContext will handle role redirection if needed
        } else {
            navigate("/auth");
        }
    }, [searchParams, navigate, setToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
