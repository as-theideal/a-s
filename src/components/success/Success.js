import React from "react";
import success from "./success.module.css";
import supabase from "../../Supabase";
import Toast from "../toast/Toast";
import { useNavigate } from "react-router-dom";

function Success() {
  const invoice_id = +(window.location.search.split("=")[1]);
  const nav = useNavigate();

  const checkInvoice = async () => {
    const go = async () => {
      await supabase.auth.getUser().then(async (user) => {
        if (user.error) {
          Toast("حدث خطا ما اعد المحاولة");
          return;
        }
        if (user.data) {
          await supabase
            .from("users")
            .select("courses")
            .eq("id", user.data.user.id)
            .then(async ({ data, error }) => {
              if (error) {
                Toast("حدث خطا ما اعد المحاولة");
                return;
              }
              if (data) {
                await supabase
                  .from("invoices")
                  .select("course_id,state,invoice_id")
                  .eq("user_id", user.data.user.id)
                  .then(async (invoices) => {
                    invoices.data.map(async(invoice , inn) =>{
                      if(invoice.invoice_id === invoice_id && !invoice.state){
                        await supabase
                        .from("users")
                        .update({
                          courses: [
                            ...data[0].courses,
                            invoices.data[inn].course_id,
                          ],
                        })
                        .eq("id", user.data.user.id);
                        await supabase
                        .from("invoices")
                        .update({ state: true })
                        .eq("invoice_id", invoice_id)
                        .then(()=>{nav("/");Toast("تم تفعيل الكورس")});
                      }else{nav("/user") ;Toast("تم تفعيل الكورس مسبقا");}
                    })
                  });
              }
            });
        }
      });
    };
    await fetch(
      `https://app.fawaterk.com/api/v2/getInvoiceData/${invoice_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 18c4a8b0a1896e1a569a7f68c6395c32e23c56f944918d2b55",
        },
      }
    ).then(async (res) => {
       const resData =await res.json().then(data=>data);
       if (resData.status === "success") {
         if (resData.data.status_text === "paid") {
          go();
        } else {
          Toast("لم يتم الفع");
          return;
        }
      }
    });
  };
  if (invoice_id) {
    checkInvoice();
  }
  return (
    <div className={success.success}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="var(--primary-color)"
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
      </svg>
      <h1>تم شراء الكورس بنجاح</h1>
      <p>لا تغلق الصفحة</p>
    </div>
  );
}

export default Success;
