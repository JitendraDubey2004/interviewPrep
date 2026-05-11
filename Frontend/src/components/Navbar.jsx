import React from "react";
import "../style/navbar.scss";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar__left">
        <div className="navbar__logo">
          <span className="logo-dot" />
          interviewPrep AI
        </div>
      </div>

      {/* Right */}
      <div className="navbar__right">
        <div className="navbar__user">
          <div className="navbar__avatar">
            {user?.email?.charAt(0)?.toUpperCase()}
          </div>

          <div className="navbar__info">
            <p className="navbar__label">Signed in as</p>
            <p className="navbar__email">{user?.username}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;