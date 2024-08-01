import React, { Fragment, useState } from "react";
import form from "./form.module.css";
import supabase from "../../Supabase";
import { useNavigate } from "react-router-dom";
import Toast from "../toast/Toast";

function Form({ type, sendUserData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [phone, setPhone] = useState("");
  const [wait, setWait] = useState(false);
  const [passType, setPassType] = useState(false);
  const formType = type === "signup";

  const reset = () => {
    setName("");
    setEmail("");
    setPass("");
    setPhone("");
  };
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWait(true);
    if (formType) {
      await supabase.auth
        .signUp({
          email: email,
          password: pass,
          options: {
            data: {
              name: name,
              phone: phone,
            },
          },
        })
        .then((data) => {
          if (data.data.user) {
            Toast("تم التسجيل");
            reset();
            setWait(false);
            nav("/login");
          } else {
            Toast(data.error.message);
          }
        });
    } else {
      await supabase.auth
        .signInWithPassword({
          email: email,
          password: pass,
        })
        .then((data) => {
          if (data.data.user) {
            sendUserData();
            setWait(false);
            reset();
            setWait(false);
            nav("/user");
            Toast("تم تسجيل الدخول");
          } else {
            Toast(data.error.message);
            setWait(false);
          }
        });
    }
  };

  return (
    <div className={form.form}>
      <form onSubmit={handleSubmit}>
        <div className={form.inner}>
          {type === "signup" && (
            <Fragment>
              <div>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="الاسم رباعي :"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span
                  style={{
                    animationName: `${!name ? "hide_span" : "show_span"}`,
                    right: 0,
                  }}
                >
                  الاسم الرباعي :
                </span>
              </div>
              <div>
                <input
                  name="phone"
                  required
                  type="number"
                  placeholder="رقم الهاتف :"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span
                  style={{
                    animationName: `${!phone ? "hide_span" : "show_span"}`,
                    right: 0,
                  }}
                >
                  رقم الهاتف :
                </span>
              </div>
            </Fragment>
          )}
          <div>
            <input
              name="email"
              required
              type="text"
              placeholder="البريد الالكتروني :"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span
              style={{
                animationName: `${!email ? "hide_span" : "show_span"}`,
                right: 0,
              }}
            >
              البريد الالكتروني :
            </span>
          </div>
          <div>
            <input
              name="password"
              required
              type={`${passType ? "text" : "password"}`}
              placeholder="كلمة السر :"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div onClick={(e) => setPassType(!passType)}>
              {passType ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="2px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              )}
            </div>
            <span
              style={{
                animationName: `${!pass ? "hide_span" : "show_span"}`,
                right: 0,
              }}
            >
              كلمة السر :
            </span>
          </div>
          <input
            type="submit"
            value={formType ? "التسجيل" : "تسجيل الدخول"}
            name="submit"
            style={{
              pointerEvents: `${wait ? "none" : "all"}`,
              opacity: `${wait ? 0.5 : 1}`,
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Form;
