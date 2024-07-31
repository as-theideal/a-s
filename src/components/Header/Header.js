// import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import header from "./header.module.css";
import logo from "../../assets/logo.png";
import { ReactSVG } from "react-svg";
import key from "../../assets/key.svg";
import usericon from "../../assets/usericon.svg";
import { useState } from "react";
import supabase from "../../Supabase";
function Header({ isLoggedIn, setIsLoggedIn, userName }) {
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const logOut = async () => {
    await supabase.auth.signOut();
    setShow(false);
    setIsLoggedIn(false);
    nav("/");
  };
  return (
    <header>
      <div className="container">
        <div className={header.nav}>
          <div className={header.bts}>
            {isLoggedIn ? (
              <div className={header.user_icon} onClick={() => setShow(!show)}>
                <ReactSVG src={usericon} />
              </div>
            ) : (
              <>
                <NavLink to="/signup" className={header.button}>
                  انشئ حسابك
                </NavLink>
                <div className={header.login}>
                  <ReactSVG src={key} />
                  <NavLink to="/login">
                    سجل{" "}
                    <span style={{ color: "var(--secondary-color)" }}>
                      الدخول
                    </span>
                  </NavLink>
                </div>
              </>
            )}
            {show && (
              <div className={header.drop_menu}>
                <ul>
                  <li
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    {userName}
                  </li>
                  <li>
                    <NavLink
                      to="/user"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      حسابي
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logOut();
                      }}
                    >
                      تسجيل الخروج
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
