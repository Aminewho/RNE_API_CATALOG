import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const renderUserCircle = (username) => {
    const initials = username.slice(0, 2).toUpperCase();
    return (
      <div
        style={{
          backgroundColor: '#0d6efd',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
        title={username}
      >
        {initials}
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">RNE</Link>
        <Link className="btn btn-outline-light" to="/">API Catalog</Link>

        <div className="ms-auto">
          {user ? (
            renderUserCircle(user.username)
          ) : (
            <Link className="btn btn-outline-light" to="/login">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
