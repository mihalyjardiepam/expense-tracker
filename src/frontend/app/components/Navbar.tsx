import { NavLink } from "react-router";
import "./Navbar.scss";
import UserMenu from "./user-menu/UserMenu";
import { useAppSelector } from "~/hooks/redux";

const Navbar = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <nav>
      <ul role="menu" className="nav">
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        {user && (
          <li className="nav-item">
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        )}

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
