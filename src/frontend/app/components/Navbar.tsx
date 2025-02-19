import { NavLink } from "react-router";
import "./Navbar.scss";
import { useContext } from "react";
import { UserContext } from "~/context/user-context";
import MatIcon from "./mat-icon/MatIcon";
import UserMenu from "./user-menu/UserMenu";

const Navbar = () => {
  const user = useContext(UserContext);

  return (
    <nav>
      <ul role="menu" className="nav">
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className="flex-spacer" aria-hidden="true"></li>
        {user ? (
          <li>
            <UserMenu />
          </li>
        ) : (
          <li className="nav-item">
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
