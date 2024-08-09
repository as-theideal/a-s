import React, { useEffect, useRef, useState } from "react";
import supabase from "../../Supabase";
import { useNavigate } from "react-router-dom";
import admin from "./admin.module.css";
import Toast from "../toast/Toast";

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [courses, setCourses] = useState();
  const [faqs, setFaqs] = useState();
  const [faqsNav, setFaqsNav] = useState("all");
  const [coursesSections, setCoursesSections] = useState([]);
  const [activePanal, setActivePanal] = useState("");
  const [activeCourse, setActiveCourse] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [correctAnswers, setCorrectANswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionsI, setQuestionsI] = useState(0);
  const videoIdToAdd = useRef("");
  const videoTitleToAdd = useRef("");
  const fileIdToAdd = useRef("");
  const fileTitleToAdd = useRef("");
  const courseTitleToAdd = useRef("");
  const coursePriceToAdd = useRef();
  const courseYearToAdd = useRef();
  const courseImgToAdd = useRef();
  const sectionTitleToAdd = useRef();
  const [newCourseId, setNewCourseId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const mcqTitle = useRef("");
  const answers_name = [setAnswer1, setAnswer2, setAnswer3, setAnswer4];
  const nav = useNavigate();

  const authenticate = async () => {
    await supabase.auth.getUser().then((data) => {
      if (data.data.user) {
        if (
          data.data.user.id === "5c0b5606-d91b-46b3-9469-c38c98b5d0ff" ||
          data.data.user.id === "c6bf9eca-3ab2-4f98-bece-f7e79403fcd3"
        ) {
          setAuthenticated(true);
        }
      } else {
        nav("/");
      }
    });
  };
  if (!authenticated) {
    authenticate();
  }

  useEffect(() => {
    const fetchCourses = async () => {
      await supabase
        .from("courses_info")
        .select("*")
        .then(async ({ data }) => {
          setCourses(data);
          data.map(async (course) => {
            await supabase
              .from(course.id)
              .select("*")
              .then(({ data, error }) => {
                if (!error) {
                  setCoursesSections((prev) =>
                    prev ? [...prev, data] : [data]
                  );
                }
              });
          });
        });
    };
    const fetchFaqs = async () => {
      await supabase
        .from("faqs")
        .select("*")
        .then(async ({ data }) => {
          setFaqs(data);
        });
    };
    if (!courses) {
      fetchCourses();
    }
    if (!faqs) {
      fetchFaqs();
    }
  }, [courses, faqs]);

  const addVideo = async () => {
    await supabase
      .from(activeCourse)
      .select("content")
      .eq("id", activeSection)
      .then(async ({ data, error }) => {
        if (!error) {
          await supabase
            .from(activeCourse)
            .update([
              {
                content: [
                  ...data[0].content,
                  {
                    type: "video",
                    url: videoIdToAdd.current.value,
                    title: videoTitleToAdd.current.value,
                  },
                ],
              },
            ])
            .eq("id", activeSection)
            .then(({ error }) => {
              if (!error) {
                Toast("تم الاضافة");
              }
            });
        }
      });
  };
  const addFile = async () => {
    await supabase
      .from(activeCourse)
      .select("content")
      .eq("id", activeSection)
      .then(async ({ data, error }) => {
        if (!error) {
          await supabase
            .from(activeCourse)
            .update([
              {
                content: [
                  ...data[0].content,
                  {
                    type: "file",
                    url: fileIdToAdd.current.value,
                    title: fileTitleToAdd.current.value,
                  },
                ],
              },
            ])
            .eq("id", activeSection)
            .then(({ error }) => {
              if (!error) {
                Toast("تم الاضافة");
              }
            });
        }
      });
  };
  const addMcq = async () => {
    if (correctAnswers.length === questions.length) {
      await supabase
        .from(activeCourse)
        .select("content")
        .eq("id", activeSection)
        .then(async ({ data, error }) => {
          if (!error) {
            await supabase
              .from(activeCourse)
              .update([
                {
                  content: [
                    ...data[0].content,
                    {
                      content: questions,
                      type: "mcq",
                      correct_answers: correctAnswers,
                      title: mcqTitle.current.value,
                    },
                  ],
                },
              ])
              .eq("id", activeSection);
          }
        });
    } else {
      Toast("اضغط على التالي قبل التسليم");
    }
  };

  const addSection = async () => {
    await supabase.from(activeCourse).insert([
      {
        title: sectionTitleToAdd.current.value,
        content: [],
      },
    ]);
  };
  const next = () => {
    const inputs = document.querySelectorAll("#add_mcq_inputs input");
    setQuestions((prev) =>
      prev.length > questionsI
        ? prev.map((pre, inn) =>
            inn !== questionsI
              ? pre
              : {
                  question: inputs[0].value,
                  answers: [
                    inputs[1].value,
                    inputs[2].value,
                    inputs[3].value,
                    inputs[4].value,
                  ],
                }
          )
        : prev.length === questionsI
        ? [
            ...prev,
            {
              question: inputs[0].value,
              answers: [
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
                inputs[4].value,
              ],
            },
          ]
        : [
            {
              question: inputs[0].value,
              answers: [
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
                inputs[4].value,
              ],
            },
          ]
    );
    setQuestionsI((prev) => prev + 1);
    if (questions[questionsI + 1]) {
      setQuestion(questions[questionsI + 1].question);
      answers_name.map((answer, inn) =>
        answer(questions[questionsI + 1].answers[inn])
      );
    } else {
      setQuestion("");
      answers_name.map((answer, inn) => answer(""));
    }
  };
  const addCorrectAnswer = (e) => {
    setCorrectANswers((prev) =>
      prev.length > questionsI
        ? prev.map((pre, inn) => (inn !== questionsI ? pre : +e.target.id))
        : prev.length === questionsI
        ? [...prev, +e.target.id]
        : [+e.target.id]
    );
  };
  const prev = () => {
    setQuestionsI((prev) => prev - 1);
    if (questions[questionsI - 1]) {
      setQuestion(questions[questionsI - 1].question);
      answers_name.map((answer, inn) =>
        answer(questions[questionsI - 1].answers[inn])
      );
    } else {
      setQuestion("");
      answers_name.map((answer, inn) => answer(""));
    }
  };

  const addCourse = async () => {
    await supabase
      .from("courses_info")
      .insert([
        {
          title: courseTitleToAdd.current.value,
          price: coursePriceToAdd.current.value,
          year: courseYearToAdd.current.value,
          img_url: courseImgToAdd.current.value,
        },
      ])
      .select("id")
      .then(({ data, error }) => setNewCourseId(data[0].id));
  };
  const handleAnswerAFaq = async (e, faq_id, inn) => {
      e.preventDefault();
      await supabase
        .from("faqs")
        .update([
          { answer: document.querySelectorAll(".faq input")[inn].value },
        ])
        .eq("id", faq_id)
        .then(({ data, error }) => !error && setFaqs(data));
    },
    handleShowUpdateAnswerForm = (inx) => {
      document.querySelectorAll(".update_answer_form").forEach((form, inn) => {
        form.style.display = inn === inx ? "flex" : "none";
      });
    },
    deleteFaq = async (id) => {
      await supabase
        .from("faqs")
        .delete()
        .eq("id", id)
        .select()
        .then(
          ({ data, error }) =>
            !error && setFaqs(faqs.filter((faq) => faq.id !== data[0].id))
        );
    };
  if (authenticated && coursesSections && courses) {
    return (
      <div className={admin.admin}>
        <div className={admin.add_element_active_panal}>
          {activePanal === "addmcq" ? (
            <div className={admin.add_mcq}>
              <input ref={mcqTitle} type="text" placeholder="العنوان" />

              <div className={admin.add_mcq_inputs} id="add_mcq_inputs">
                <input
                  type="text"
                  placeholder="السؤال :"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div>
                  <input
                    type="text"
                    placeholder="ا"
                    id="ا"
                    value={answer1}
                    onChange={(e) => setAnswer1(e.target.value)}
                  />
                  <span
                    onClick={addCorrectAnswer}
                    type="text"
                    id="0"
                    style={{
                      backgroundColor: `${
                        correctAnswers[questionsI] === 0
                          ? "var(--primary-color)"
                          : "#eee"
                      }`,
                    }}
                  ></span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="ب"
                    id="ب"
                    value={answer2}
                    onChange={(e) => setAnswer2(e.target.value)}
                  />
                  <span
                    onClick={addCorrectAnswer}
                    type="text"
                    id="1"
                    style={{
                      backgroundColor: `${
                        correctAnswers[questionsI] === 1
                          ? "var(--primary-color)"
                          : "#eee"
                      }`,
                    }}
                  ></span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="ج"
                    id="ج"
                    value={answer3}
                    onChange={(e) => setAnswer3(e.target.value)}
                  />
                  <span
                    onClick={addCorrectAnswer}
                    type="text"
                    id="2"
                    style={{
                      backgroundColor: `${
                        correctAnswers[questionsI] === 2
                          ? "var(--primary-color)"
                          : "#eee"
                      }`,
                    }}
                  ></span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="د"
                    id="د"
                    value={answer4}
                    onChange={(e) => setAnswer4(e.target.value)}
                  />
                  <span
                    onClick={addCorrectAnswer}
                    type="text"
                    id="3"
                    style={{
                      backgroundColor: `${
                        correctAnswers[questionsI] === 3
                          ? "var(--primary-color)"
                          : "#eee"
                      }`,
                    }}
                  ></span>
                </div>
              </div>
              <div className={admin.add_mcq_bts}>
                <button onClick={next}>التالي</button>
                <button onClick={prev}>السابق</button>
                <button
                  onClick={() => {
                    activeSection && addMcq();
                  }}
                >
                  تسليم
                </button>
              </div>
            </div>
          ) : activePanal === "addvideo" ? (
            <div className={admin.add_video}>
              <input type="text" ref={videoIdToAdd} placeholder="ايدي الفييو" />
              <input
                type="text"
                ref={videoTitleToAdd}
                placeholder="عنوان الفيديو"
              />
              <button
                onClick={() => {
                  activeSection && addVideo();
                }}
              >
                اضافة الفيديو
              </button>
            </div>
          ) : activePanal === "addfile" ? (
            <div className={admin.add_file}>
              <input type="text" ref={fileIdToAdd} placeholder="ايدي الملف" />
              <input
                type="text"
                ref={fileTitleToAdd}
                placeholder="عنوان الملف"
              />
              <button
                onClick={() => {
                  activeSection && addFile();
                }}
              >
                اضافة الملف
              </button>
            </div>
          ) : (
            activePanal === "add_section" && (
              <div className={admin.add_section}>
                <input
                  type="text"
                  ref={sectionTitleToAdd}
                  placeholder="عنوان القسم"
                />

                <button onClick={addSection}>اضافة قسم</button>
              </div>
            )
          )}
        </div>
        <hr />
        <div className={admin.courses_list}>
          {courses.map((course, inn) => {
            return (
              <div className={admin.course} key={inn}>
                <img
                  src={`https://as-theideal.b-cdn.net/courses_imgs/${course.img_url}`}
                  alt="img"
                />
                <p>{course.title}</p>
                <span>السنة الدراسية : {course.year}</span>
                {coursesSections[inn] &&
                  coursesSections[inn].map((section) => {
                    return (
                      <span
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setActiveCourse(course.id);
                        }}
                        style={{
                          backgroundColor: `${
                            course.id === activeCourse
                              ? section.id === activeSection
                                ? "var(--primary-color)"
                                : "#eee"
                              : "#eee"
                          }`,
                        }}
                      >
                        {section.title}
                      </span>
                    );
                  })}
                <span
                  onClick={() => {
                    setActivePanal("add_section");
                    setActiveCourse(course.id);
                  }}
                >
                  اضافة قسم
                </span>
                <div className={admin.spans}>
                  <span
                    onClick={() => {
                      setActivePanal("addmcq");
                      setActiveCourse(course.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                    </svg>
                  </span>
                  <span
                    onClick={() => {
                      setActivePanal("addvideo");
                      setActiveCourse(course.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
                    </svg>
                  </span>
                  <span
                    onClick={() => {
                      setActivePanal("addfile");
                      setActiveCourse(course.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <hr />
        {newCourseId ? (
          <p
            style={{ textAlign: "center", width: "100%" }}
            onClick={async () =>
              await navigator.clipboard
                .writeText(newCourseId)
                .then(Toast("تم النسخ"))
            }
          >
            {newCourseId}
          </p>
        ) : (
          <div className={admin.add_course}>
            <input
              type="text"
              ref={courseTitleToAdd}
              placeholder="عنوان الكورس"
            />
            <input
              type="number"
              ref={courseYearToAdd}
              placeholder="السنة الدراسية"
            />
            <input type="text" ref={courseImgToAdd} placeholder="اسم الصورة" />
            <input
              type="number"
              ref={coursePriceToAdd}
              placeholder="سعر الكورس"
            />
            <button onClick={addCourse}>اضف الكورس</button>
          </div>
        )}
        <hr />
        <div className={admin.faqs}>
          <div className={admin.faqs_nav}>
            <button onClick={() => setFaqsNav("unanswered")}>
              غير المجاب عليه
            </button>
            <button onClick={() => setFaqsNav("answered")}>المجاب عليه</button>
          </div>
          {faqs && (
            <div className={admin.faqs_list}>
              {faqsNav === "all"
                ? faqs.map((faq, inn) => (
                    <div
                      key={inn}
                      className="faq"
                      style={{ paddingLeft: `${faq.answer && "40px"}` }}
                    >
                      <span onDoubleClick={() => deleteFaq(faq.id)}>x</span>
                      <p>س : {faq.question}</p>

                      {!faq.answer ? (
                        <form
                          onSubmit={(e) => handleAnswerAFaq(e, faq.id, inn)}
                        >
                          <input type="text" placeholder="الاجابة : " />
                          <input type="submit" value="ارسال" />
                        </form>
                      ) : (
                        <>
                          <p>ا : {faq.answer}</p>
                          <button
                            onClick={() => handleShowUpdateAnswerForm(inn)}
                          >
                            E
                          </button>
                          <form
                            style={{ display: "none" }}
                            onSubmit={(e) => handleAnswerAFaq(e, faq.id, inn)}
                            className="update_answer_form"
                          >
                            <input type="text" placeholder="الاجابة : " />
                            <input type="submit" value="ارسال" />
                          </form>
                        </>
                      )}
                    </div>
                  ))
                : faqsNav === "answered"
                ? faqs
                    .filter((faq) => faq.answer)
                    .map((faq, inn) => (
                      <div
                        key={inn}
                        className="faq"
                        style={{ paddingLeft: `${faq.answer && "40px"}` }}
                      >
                        <span onDoubleClick={() => deleteFaq(faq.id)}>x</span>
                        <p>س : {faq.question}</p>
                        <p>ا : {faq.answer}</p>
                        <button onClick={() => handleShowUpdateAnswerForm(inn)}>
                          E
                        </button>
                        <form
                          style={{ display: "none" }}
                          onSubmit={(e) => handleAnswerAFaq(e, faq.id, inn)}
                          className="update_answer_form"
                        >
                          <input type="text" placeholder="الاجابة : " />
                          <input type="submit" value="ارسال" />
                        </form>
                      </div>
                    ))
                : faqs
                    .filter((faq) => !faq.answer)
                    .map((faq, inn) => (
                      <div key={inn} className="faq">
                        <span onDoubleClick={() => deleteFaq(faq.id)}>x</span>
                        <p>س : {faq.question}</p>
                        <form
                          onSubmit={(e) => handleAnswerAFaq(e, faq.id, inn)}
                        >
                          <input type="text" placeholder="الاجابة : " />
                          <input type="submit" value="ارسال" />
                        </form>
                      </div>
                    ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Admin;
