import React, { useState } from "react";
import profile from "./profile.module.css";
import Lottie from "react-lottie-player";
import identity from "../../../assets/Animation - 1722197614706.json";
import supabase from "../../../Supabase";
import Toast from "../../toast/Toast";

function Profile({ user }) {
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [wait, setWait] = useState(false);
  const hanldeUpdatePass = async () => {
    setWait(true);
    if (newPass === reNewPass) {
      await supabase.auth
        .updateUser({
          password: newPass,
        })
        .then(({ error }) => {
          if (error) {
            Toast(error.message);
            return;
          } else {
            Toast("تم تغيير كلمة السر");
          }
        });
    } else {
      Toast("كلمة السر غير متطابقة");
    }
    setWait(false);
  };
  return (
    <div className={profile.profile}>
      <div className={profile.details}>
        <div className={profile.lottie}>
          <Lottie
            loop
            animationData={identity}
            play
            style={{ width: 200, height: 200 }}
          />
        </div>
        <div>
          <h1>{user.name}</h1>
          <hr />
          <div className={profile.cards}>
            <div className={profile.card}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#F19E39"
              >
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v58q0 26 17 44t43 18q26 0 43-18t17-44v-58q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h200v80H480Zm0-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z" />
              </svg>
              <p>{user.email}</p>
            </div>
            <div className={profile.card}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#F19E39"
              >
                <path d="M162-120q-18 0-30-12t-12-30v-162q0-13 9-23.5t23-14.5l138-28q14-2 28.5 2.5T342-374l94 94q38-22 72-48.5t65-57.5q33-32 60.5-66.5T681-524l-97-98q-8-8-11-19t-1-27l26-140q2-13 13-22.5t25-9.5h162q18 0 30 12t12 30q0 125-54.5 247T631-329Q531-229 409-174.5T162-120Zm556-480q17-39 26-79t14-81h-88l-18 94 66 66ZM360-244l-66-66-94 20v88q41-3 81-14t79-28Zm358-356ZM360-244Z" />
              </svg>

              <p>{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className={profile.change_pass}>
        <h1>تغيير كلمة السر</h1>
        <input
          type="text"
          placeholder="كلمة السر الجديدة"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <input
          type="text"
          placeholder="اعد كلمة السر الجديدة"
          value={reNewPass}
          onChange={(e) => setReNewPass(e.target.value)}
        />
        <button
          onClick={hanldeUpdatePass}
          style={{
            pointerEvents: `${wait ? "none" : "all"}`,
            opacity: `${wait ? 0.5 : 1}`,
          }}
        >
          تغيير
        </button>
      </div>
    </div>
  );
}

export default Profile;
