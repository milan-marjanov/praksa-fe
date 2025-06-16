import { Navigate, useLocation } from 'react-router-dom';
import { JSX } from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtDecoded } from '../../types/User';

type Props = {
  children: JSX.Element;
  allowedRoles: ('ADMIN' | 'USER')[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const location = useLocation();
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const { exp, role } = jwtDecode<JwtDecoded>(token);

    if (exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
      return <Navigate to="/login" replace />;
    }

    const hasAccess = allowedRoles.includes(role);
    return hasAccess ? children : <Navigate to="/unauthorized" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
