import { NavLink } from "react-router";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav>
      <ul className="nav">
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="flex-spacer" aria-hidden="true"></li>
        <li className="nav-item">
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
