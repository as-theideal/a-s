import React, { useEffect, useState } from "react";
import years from './years.module.css'
import Toast from "../toast/Toast";
import supabase from "../../Supabase";
import axios from "axios";

function Years() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [userId, setUserId] = useState("");
  const [wait, setWait] = useState(false);
  const selectedYear = window.location.pathname.split("/")[2];
  useEffect(() => {
    if (!user) {
      const fetchUserData = async () => {
        await supabase.auth.getUser().then(async ({ data, error }) => {
          if (error) {
            Toast(error.message);
            return;
          }
          if (data) {
            setUser(data.user.user_metadata);
            setUserId(data.user.id);
          }
        });
      };
      fetchUserData();
    }
    const fetchCoursesforSelectedYear = async () => {
      await supabase
        .from("courses_info")
        .select("*")
        .eq("year", selectedYear)
        .then(({ data, error }) => {
          if (error) {
            Toast(error);
            return;
          }
          if (data.length) {
            setData(data);
          }
        });
    };
    fetchCoursesforSelectedYear();
  }, [selectedYear, setData, user]);

  const pay = (course_id, course_price) => {
    Toast("سيتم ارسال رسالة الى رقمك بعد انشاء الفاتورة")
    var data = JSON.stringify({
      payment_method_id: 3,
      cartTotal: course_price,
      currency: "EGP",
      sendSMS:true,
      customer: {
        first_name: user.name.split(" ")[0],
        last_name: user.name.split(" ")[1],
        email: user.email,
        phone: user.phone,
      },
      redirectionUrls: {
        successUrl: "http://localhost:3000/success",
        failUrl: "http://localhost:3000/",
        pendingUrl: "http://localhost:3000/user",
      },
      cartItems: [
        {
          name: "course",
          price: course_price,
          quantity: "1",
        },
      ],
    });

    var config = {
      method: "post",
      url: "https://app.fawaterk.com/api/v2/invoiceInitPay",
      headers: {
        Authorization:
          "Bearer 18c4a8b0a1896e1a569a7f68c6395c32e23c56f944918d2b55",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async ({ data }) => {
        window.location.href = `https://app.fawaterk.com/invoice/${data.data.invoice_id}/${data.data.invoice_key}`;
        await supabase.from("invoices").insert({
          invoice_id: data.data.invoice_id,
          course_id: course_id,
          user_id: userId,
          expire_date: data.data.payment_data.expireDate,
          fawry_code: data.data.payment_data.fawryCode,
          invoice_key: data.data.invoice_key,
        });
      })
      .catch(function (error) {
        Toast(error);
      });
      setWait(false)
  };

  return data.length && (
    <div className={years.years}>
      {data.map((course, inn) => {
        return (
          <div key={inn} style={{pointerEvents:`${wait ? "none" :"all"}`,opacity:`${wait ? 0.5:1}`}}>
            <img
              src={`https://storage.bunnycdn.com/as-main/courses_imgs/${course.img_url}?accessKey=113323c4-16ee-47ea-a2c0b1fd2943-03a6-4b68`}
              alt="img"
            />
            <p>{course.title}</p>
            <span>{course.price} جنيه </span>
            <button
              className="primary_bt"
              onClick={() => {pay(course.id, course.price) ; setWait(true)}}
            >
              شراء
            </button>
          </div>
        );
      })}
    </div>
  )
}

export default Years;
