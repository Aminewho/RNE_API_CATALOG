import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"> RNE</Link>
        <Link className="btn btn-outline-light" to="/">
             API Catalog
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
