import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, isAuthenticated, user, onLogout }) {
  const auth = useAuth();
  
  const isAuth = isAuthenticated !== undefined ? isAuthenticated : auth.isAuthenticated;
  const currentUser = user !== undefined ? user : auth.user;
  const handleLogout = onLogout || auth.logout;

  return (
    <>
      <Navbar isAuthenticated={isAuth} user={currentUser} onLogout={handleLogout} />
      <main className="page-wrapper">{children}</main>
      <Footer />
    </>
  );
}
