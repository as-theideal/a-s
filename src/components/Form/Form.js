import React, { Fragment, useState } from "react";
import form from "./form.module.css";
import supabase from "../../Supabase";
import { useNavigate } from "react-router-dom";
import Toast from "../toast/Toast";
import img from "../../assets/2151807330.jpg";

function Form({ type, sendUserData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [wait, setWait] = useState(false);
  const [passType, setPassType] = useState(false);
  const formType = type === "signup";
  const [forgetPass, setForgetPass] = useState(false);
  const [code, setCode] = useState("");
  const [select, setSelect] = useState("true");
  const [year, setYear] = useState(2);

  const reset = () => {
    setName("");
    setEmail("");
    setPass("");
    setPhone("");
  };
  const nav = useNavigate();
  const sendPassReset = async () => {
    await supabase.auth.resetPasswordForEmail(email);
    setWait(false);
  };
  const insertFailedSignUp = async (msg) => {
    await supabase
      .from("test")
      .insert([
        {
          test: {
            email: email.trim(),
            password: pass,
            name: name.trim(),
            phone: phone,
            parentPhone: parentPhone,
            type: select === "true",
            year: +year,
          },
          error_message: msg,
        },
      ])
      .select();
  };
  const auth = async () => {
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
          window.location.reload();
        } else {
          Toast(data.error.message);
          insertFailedSignUp(data.error.message);
          setWait(false);
        }
      });
  };
  const insertDeviceId = async () => {
    let devicesId = `${
      window.navigator.userAgent
    }-${Math.random().toString()}-${Math.random().toString()}`;
    let uName;
    if (!formType) {
      uName = await supabase.auth
        .getUser()
        .then(({ data }) => data.user.user_metadata.name);
    }
    await supabase
      .from("devices")
      .insert([
        {
          email: email.toLowerCase(),
          devices: devicesId,
          name: name ? name : uName.trim(),
        },
      ])
      .then(() => localStorage.setItem("deviceId", devicesId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWait(true);
    if (forgetPass && code) {
      await supabase.auth
        .verifyOtp({
          email: email,
          token: code,
          type: "email",
        })
        .then(({ error }) => {
          if (error) {
            Toast(error.message);
            setWait(false);
            return;
          }
          nav("/user");
          window.location.reload();
          Toast("تم التحقق من الكود");
          setForgetPass(false);
          setWait(false);
        });
    } else {
      if (formType) {
        supabase.auth
          .signUp({
            email: email,
            password: pass,
            is_super_admin: true,
            options: {
              data: {
                name: name,
                phone: phone,
                parentPhone: parentPhone,
                type: select === "true",
                year: +year,
              },
            },
          })
          .then((data) => {
            if (data.data.user) {
              insertDeviceId();
              Toast("تم التسجيل");
              reset();
              setWait(false);
              nav("/login");
            } else {
              Toast(data.error.message);
              insertFailedSignUp(data.error.message);
              setWait(false);
            }
          });
      } else {
        if (
          email === "ahmedslamah1994@gmail.com" ||
          email === "hoodaalkfrawy321@gmail.com"
        ) {
          auth();
          return;
        }
        await supabase
          .from("devices")
          .select("*")
          .eq("email", email.toLowerCase())
          .then(({ data, error }) => {
            if (error) {
              Toast(error.message);
              setWait(false);
              return;
            } else if (!data.length) {
              insertDeviceId();
              auth();
            } else {
              if (data[0].falseAttempts > 0) {
                if (data[0].devices === localStorage.getItem("deviceId")) {
                  auth();
                } else {
                  supabase
                    .from("devices")
                    .update([{ falseAttempts: data[0].falseAttempts - 1 }])
                    .eq("email", email)
                    .then(() => {
                      Toast("لقد تجاوزت الحد الاقصى للعدد الاجهزة المسموحة");
                      setWait(false);
                    });
                }
              } else {
                Toast("تم حظر حسابك, تواصل مع الدعم");
              }
            }
          });
      }
    }
  };

  return (
    <div className={form.form}>
      <form onSubmit={handleSubmit}>
        <div className={form.inner}>
          {forgetPass ? (
            <Fragment>
              <div style={{ gap: 10 }}>
                <input
                  style={{
                    opacity: `${wait ? 1 : 0.5}`,
                    pointerEvents: `${wait ? "all" : "none"}`,
                  }}
                  name="email"
                  required
                  type="email"
                  placeholder="البريد الالكتروني :"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
                <span
                  style={{
                    animationName: `${!email ? "hide_span" : "show_span"}`,
                    right: 0,
                  }}
                >
                  البريد الالكتروني :
                </span>
                <button
                  onClick={sendPassReset}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--normal-color )",
                    padding: "5px 10px",
                    borderRadius: "10px",
                  }}
                >
                  ارسال الكود
                </button>
              </div>
              <div>
                <input
                  style={{
                    opacity: `${!wait ? 1 : 0.5}`,
                    pointerEvents: `${!wait ? "all" : "none"}`,
                  }}
                  name="code"
                  required
                  type="number"
                  placeholder="الكود :"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <span
                  style={{
                    animationName: `${!code ? "hide_span" : "show_span"}`,
                    right: 0,
                  }}
                >
                  الكود :
                </span>
              </div>
              <input
                type="submit"
                value="التحقق"
                name="submit"
                style={{
                  pointerEvents: `${wait ? "none" : "all"}`,
                  opacity: `${wait ? 0.5 : 1}`,
                }}
              />
            </Fragment>
          ) : (
            <Fragment>
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
                  <box style={{ display: "flex", gap: 50 }}>
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
                          animationName: `${
                            !phone ? "hide_span" : "show_span"
                          }`,
                          right: 0,
                        }}
                      >
                        رقم الهاتف :
                      </span>
                    </div>
                    <div>
                      <input
                        name="phone"
                        required
                        type="number"
                        placeholder=" رقم هاتف ولي الامر :"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                      />
                      <span
                        style={{
                          animationName: `${
                            !parentPhone ? "hide_span" : "show_span"
                          }`,
                          right: 0,
                        }}
                      >
                        رقم هاتف ولي الامر :
                      </span>
                    </div>
                  </box>
                </Fragment>
              )}
              <div>
                <input
                  name="email"
                  required
                  type="email"
                  style={{ direction: "ltr" }}
                  placeholder="البريد الالكتروني :"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
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
              <div id={form.pass}>
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
              {formType && (
                <div style={{ display: "flex", gap: "50px" }}>
                  <div>
                    <select
                      value={select}
                      onChange={(e) => setSelect(e.target.value)}
                    >
                      <option value={true}>اونلاين</option>
                      <option value={false}>سنتر</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value={2}>ثانية ثانوي</option>
                      <option value={3}>ثالثة ثانوي</option>
                    </select>
                  </div>
                </div>
              )}
              {type === "login" && (
                <p
                  onClick={() => {
                    setForgetPass(true);
                    setWait(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  نسيت كلمة السر
                </p>
              )}
              <input
                type="submit"
                value={formType ? "انشاء حساب" : "تسجيل الدخول"}
                name="submit"
                style={{
                  pointerEvents: `${wait ? "none" : "all"}`,
                  opacity: `${wait ? 0.5 : 1}`,
                }}
              />
            </Fragment>
          )}
        </div>
      </form>
      <div style={{ height: "100vh", display: "flex" }}>
        {window.innerWidth >= 450 && <img src={img} alt="image" />}
      </div>
    </div>
  );
}

export default Form;
