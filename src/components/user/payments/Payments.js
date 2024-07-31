import React, { useEffect, useState } from "react";
import supabase from "../../../Supabase";
import payments from "./payments.module.css";
import Toast from "../../toast/Toast";

function Payments({ userId }) {
  const [invoices, setInvoices] = useState([]);
  const [wait ,setWait]= useState(false)
  useEffect(() => {
    const fetchInvoices = async () => {
      await supabase
        .from("invoices")
        .select("course_id,state,expire_date,fawry_code,invoice_id,invoice_key")
        .eq("user_id", userId)
        .then(({ data, error }) => {
          if (error) {
            Toast("حدث خطا ما");
            return;
          }
          if (data) {
            setInvoices(data.reverse());
          }
        });
    };
    fetchInvoices();
  }, [setInvoices, userId]);

  const checkInvoice = async (invoice_id) => {
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
                        .then(Toast("تم تفعيل الكورس"));
                      }else{Toast("تم تفعيل الكورس مسبقا");}
                    })
                  });
              }
            });
        }
      });
      setWait(false)
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
          go(resData.data.invoice_id);
        } else {
          Toast("لم يتم الفع");
          setWait(false);
          return;
        }
      }
    });
  };
  return (
    <div className={payments.payments}>
      <div className={payments.titles}>
        <span>الرقم المرجعي</span>
        <span>تاريخ انتهاء الصلاحية </span>
      </div>
      {invoices.map((invoice, inn) => {
        return (
          new Date(invoice.expire_date) > new Date() && (
            <div
              key={inn}
              className={payments.invoice}
              style={{
                border: `1px solid ${invoice.state ? "green" : "red"}`,
                textDecorationLine: `${
                  invoice.state ? "line-through" : "none"
                }`,
                pointerEvents: `${invoice.state? "none" : wait ? "none" : !invoice.state ? "all" : !wait && "none"}`,
                opacity: `${wait? 0.5 : 1}`,
              }}
            >
              <button
                onClick={() =>
                  (window.location.href = `https://app.fawaterk.com/invoice/${invoice.invoice_id}/${invoice.invoice_key}`)
                }
              >
                ادفع
              </button>
              <button onClick={() => {checkInvoice(invoice.invoice_id); setWait(true)}}>
                لقد دفعت
              </button>
              <span>{new Date(invoice.expire_date).toLocaleString()}</span>
              <span>{invoice.fawry_code}</span>
            </div>
          )
        );
      })}
    </div>
  );
}

export default Payments;
