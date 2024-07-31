import React from "react";
import title from "./title.module.css";

function LeftColTitle({ text }) {
  return <p className={title.header}>{text}</p>;
}

export default LeftColTitle;
