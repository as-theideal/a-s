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
              placeholder="البريد الالكتوني :"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span
              style={{
                animationName: `${!email ? "hide_span" : "show_span"}`,
                right: 0,
              }}
            >
              البريد الالكتوني :
            </span>
          </div>
          <div>
            <input
              name="password"
              required
              type="password"
              placeholder="كلمة السر :"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
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
