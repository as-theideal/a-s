import React from "react";
import home from "./home.module.css";

function Footer() {
  return (
    <div
      onClick={() =>
        (window.location.href = "mohamed-alkfrawy.dr-ahmed-salama.com")
      }
      className={home.footer}
    >
      created by MhmdKfraa
    </div>
  );
}

export default Footer;
