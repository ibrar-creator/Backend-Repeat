import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getMe } from "../features/auth/authService";

function PublicRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        await getMe();

        if (mounted) {
          setAuthenticated(true);
        }

      } catch (error) {
        if (mounted) {
          setAuthenticated(false);
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <h2>Checking authentication...</h2>;
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;