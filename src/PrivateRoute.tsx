import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

function PrivateRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Carregando...</div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
