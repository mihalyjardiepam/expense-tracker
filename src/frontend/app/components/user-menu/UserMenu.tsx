import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent as SyntheticMouseEvent,
} from "react";
import { UserContext } from "~/context/user-context";
import MatIcon from "../mat-icon/MatIcon";
import "./UserMenu.scss";
import { NavLink } from "react-router";

const UserMenu = () => {
  const user = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    window.addEventListener("click", checkClickOutside);
    return () => {
      window.removeEventListener("click", checkClickOutside);
    };
  });

  const checkClickOutside = useCallback((event: MouseEvent) => {
    if (!wrapperRef.current) {
      return;
    }

    const wrapperEl = wrapperRef.current as HTMLDivElement;
    const targetEl = event.target as HTMLElement;

    if (
      targetEl.hasAttribute("data-popup-close") ||
      !wrapperEl.contains(targetEl)
    ) {
      setShowMenu(false);
    }
  }, []);

  const toggleMenu = (evt: SyntheticMouseEvent) => {
    evt.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div className="menu-wrapper" ref={wrapperRef}>
      <button
        aria-haspopup="menu"
        className={`user-menu-button ${showMenu ? "expanded" : ""}`}
        aria-expanded={showMenu}
        onClick={toggleMenu}
        aria-controls="#user-menu"
        aria-label="User Menu"
      >
        <span className="icon">
          <MatIcon>person</MatIcon>
        </span>
        <span className="name">{user?.name}</span>
      </button>
      <div
        className={`popup-content ${showMenu ? "expanded" : ""}`}
        id="user-menu"
      >
        <ul role="menu">
          <li>
            <NavLink to="/settings" className="menu-button" data-popup-close>
              <span className="icon">
                <MatIcon>settings</MatIcon>
              </span>
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout" className="menu-button" data-popup-close>
              <span className="icon">
                <MatIcon>logout</MatIcon>
              </span>
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(UserMenu);
