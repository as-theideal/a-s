import React, { useEffect, useRef, useState } from "react";
import supabase, { adminSupabase } from "../../Supabase";
import { useNavigate } from "react-router-dom";
import admin from "./admin.module.css";
import Toast from "../toast/Toast";

function Admin() {
  // State to track if the user is authenticated
  const [authenticated, setAuthenticated] = useState(false);

  // State to hold the list of courses
  const [courses, setCourses] = useState([]);

  // State to hold the list of FAQs
  const [faqs, setFaqs] = useState([]);

  // State to manage the navigation between different FAQ views (e.g., all, answered, unanswered)
  const [faqsNav, setFaqsNav] = useState("all");

  // State to hold sections for each course
  const [coursesSections] = useState([]);
  // State to hold banned for each course
  const [banned, setBanned] = useState([]);

  // State to hold unapproved for each course
  const [unapproved, setUnapproved] = useState([]);

  const [users, setUsers] = useState([]);

  const [exams, setExams] = useState([]);

  // State to track the currently active panel in the admin interface
  const [activePanal, setActivePanal] = useState("");

  const [activeExam, setActiveExam] = useState(null);

  // State to track the currently active course
  const [activeCourse, setActiveCourse] = useState("");

  // State to track the currently active section within a course
  const [activeSection, setActiveSection] = useState([]);

  // State to hold correct answers for questions
  const [correctAnswers, setCorrectANswers] = useState([]);

  // State to hold questions for the MCQ (multiple-choice questions)
  const [questions, setQuestions] = useState([]);

  // State to track the index of the current question being edited or viewed
  const [questionsI, setQuestionsI] = useState(0);

  // Refs to hold references to various input elements
  const questionImg = useRef();
  const videoIdToAdd = useRef("");
  const videoTitleToAdd = useRef("");
  const fileIdToAdd = useRef("");
  const fileTitleToAdd = useRef("");
  const courseTitleToAdd = useRef("");
  const coursePriceToAdd = useRef();
  const courseYearToAdd = useRef();
  const courseImgToAdd = useRef();
  const sectionTitleToAdd = useRef();
  const resetDeviceEmail = useRef();
  const [searchUser, setSearchUser] = useState("");
  const [resetDevice, setResetDevice] = useState([]);

  // State to hold the ID of the newly created course
  const [newCourseId, setNewCourseId] = useState("");

  // State to hold the question text for MCQs
  const [question, setQuestion] = useState("");

  // States to hold answers for the MCQ options
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");

  const [mcqTimer, setMcqTimer] = useState();
  // Ref to hold the title of the MCQ
  const [mcqTitle, setMcqTitle] = useState("");

  // Array of functions to set answers (for easier management)
  const answers_name = [setAnswer1, setAnswer2, setAnswer3, setAnswer4];

  // Navigation hook for programmatic navigation
  const nav = useNavigate();
  const authenticate = async () => {
    await supabase.auth.getUser().then((data) => {
      if (data.data.user) {
        if (
          data.data.user.id === "5c0b5606-d91b-46b3-9469-c38c98b5d0ff" ||
          data.data.user.id === "c8938a0f-e0aa-493b-a4a2-5298a29d89a7"
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
    supabase
      .from("courses_info")
      .select("*")
      .then(async ({ data }) => {
        data.map(async (course) => {
          await supabase
            .from(course.id)
            .select("*")
            .then(({ data, error }) => {
              if (!error) {
                setCourses((prev) =>
                  prev
                    ? [...prev, { ...course, sections: data }]
                    : { course, section: data }
                );
              }
            });
        });
      });
    supabase
      .from("center_courses")
      .select("*")
      .then(async ({ data }) => {
        data.map(async (course) => {
          await supabase
            .from(course.id)
            .select("*")
            .then(({ data, error }) => {
              if (!error) {
                setCourses((prev) =>
                  prev
                    ? [...prev, { ...course, sections: data }]
                    : { course, section: data }
                );
              }
            });
        });
      });

    supabase
      .from("devices")
      .select("*")
      .eq("falseAttempts", 0)
      .then(async ({ data }) => {
        data && setBanned(data);
      });

    supabase
      .from("users")
      .select("id,approved,name,email,year")
      .eq("approved", false)
      .then(async ({ data }) => {
        data && setUnapproved(data);
      });

    supabase
      .from("faqs")
      .select("*")
      .then(async ({ data }) => {
        setFaqs(data);
      });
    supabase
      .from("exams")
      .select("*")
      .then(async ({ data }) => {
        setExams(data);
      });
  }, []);

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
      if (activePanal === "addmcq") {
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
                        title: mcqTitle,
                      },
                    ],
                  },
                ])
                .eq("id", activeSection);
            }
          });
      } else if (activePanal === "addExam") {
        await supabase
          .from("exams")
          .insert([
            {
              correct_answers: correctAnswers,
              title: mcqTitle,
              questions: questions,
              timer: mcqTimer,
            },
          ])
          .select("*")
          .then(async ({ error, data }) => {
            if (error) {
              Toast(error.message);
              return;
            }
            setExams((prev) => [
              ...prev,
              {
                correct_answers: correctAnswers,
                title: mcqTitle,
                questions: questions,
                timer: mcqTimer,
                id: data[0].id,
              },
            ]);
            await navigator.clipboard
              .writeText("https://dr-ahmed-salama.com/exam/" + data[0].id)
              .then(Toast("تم نسخ الرابط"));
          });
      } else if (activePanal === "editExam") {
        await supabase
          .from("exams")
          .update([
            {
              correct_answers: correctAnswers,
              title: mcqTitle,
              questions: questions,
              timer: mcqTimer,
            },
          ])
          .eq("id", activeExam)
          .select("*")
          .then(async ({ error, data }) => {
            if (error) {
              Toast(error.message);
              return;
            }
            setExams(data);
          });
        window.location.reload();
      }
      setActiveExam(null);
    } else {
      Toast("اضغط على التالي قبل التسليم");
    }
  };
  const uploadFile = async () => {
    await supabase.storage
      .from("courses_questions_imgs")
      .upload(`${Math.random()}`, questionImg.current.files[0])
      .then(({ data, error }) => {
        if (error) {
          Toast(error.message);
          return;
        }
        Toast("تم الرفع");
        setQuestion(data.path);
      });
  };
  const addSection = async () => {
    await supabase
      .from(activeCourse)
      .insert([
        {
          title: sectionTitleToAdd.current.value,
          content: [],
        },
      ])
      .then(Toast("تم"));
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
      answers_name.map((answer) => answer(""));
      questionImg.current.value = "";
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
      answers_name.map((answer) => answer(""));
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
      .then(({ data }) => setNewCourseId(data[0].id));
  };
  const handleShowUpdateAnswerForm = (inx) => {
    document.querySelectorAll(".update_answer_form").forEach((form, inn) => {
      form.style.display = inn === inx ? "flex" : "none";
    });
  };

  const handleAnswerAFaq = async (e, faq_id, inn) => {
      e.preventDefault();
      await supabase
        .from("faqs")
        .update([
          { answer: document.querySelectorAll(".faq form")[inn][0].value },
        ])
        .eq("id", faq_id)
        .select()
        .then(({ data, error }) => {
          !error &&
            setFaqs((prev) =>
              prev.map((faq) => (faq.id === data[0].id ? data[0] : faq))
            );
          handleShowUpdateAnswerForm();
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
  const unbanUser = (id) => {
    supabase
      .from("devices")
      .update([{ falseAttempts: 10 }])
      .eq("id", id)
      .then(() => {
        setBanned((prev) => prev.filter((ban) => ban.id !== id));
        Toast("تم فك الحظر");
      });
  };
  const deleteUser = (id, email) => {
    adminSupabase.auth.admin.deleteUser(id).then(() => {
      supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .then((data) => {
          Toast("تم الحذف");
          setUnapproved((prev) =>
            prev.filter((unapproved) => unapproved.id !== id)
          );
        });
      supabase.from("devices").delete().eq("email", email);
      users.length &&
        setUsers((prev) => prev.filter((unapproved) => unapproved.id !== id));
    });
  };
  const approveUser = (id) => {
    Toast("تم القبول");
    supabase
      .from("users")
      .update([{ approved: true }])
      .eq("id", id)
      .then(() => {
        setUnapproved((prev) =>
          prev.filter((unapproved) => unapproved.id !== id)
        );
      });
  };
  const showExam = (id) => {
    setActiveExam((prev) => (prev === id ? null : id));
  };
  const editExam = (inx) => {
    setQuestions(exams[inx].questions);
    setCorrectANswers(exams[inx].correct_answers);

    setQuestion(exams[inx].questions[0].question);
    answers_name.map((answer, inn) =>
      answer(exams[inx].questions[0].answers[inn])
    );
    setMcqTitle(exams[inx].title);
    setMcqTimer(exams[inx].timer);
    setActivePanal((prev) => (prev === "editExam" ? null : "editExam"));
  };
  const handleResetDevice = async (id) => {
    await supabase
      .from("devices")
      .delete()
      .eq("id", id)
      .then(() => {
        Toast("تم");
        setResetDevice([]);
      });
  };
  const handleFetchResetDevice = async () => {
    supabase
      .from("devices")
      .select("name,id")
      .eq("email", resetDeviceEmail.current.value)
      .then(({ data }) => {
        setResetDevice(data);
        Toast(`${data.length ? "تم" : "لا يوجد"}`);
      });
  };
  const fetchUsers = async (year) => {
    await supabase
      .from("users")
      .select("id,email,phone,parent_phone,name")
      .eq("year", year)
      .then(({ data }) => {
        setUsers(data);
      });
  };
  if (authenticated && coursesSections && courses) {
    return (
      <div className={admin.admin}>
        <div className={admin.add_element_active_panal}>
          {activePanal === "addmcq" ||
          activePanal === "addExam" ||
          activePanal === "editExam" ? (
            <div className={admin.add_mcq}>
              {activePanal === "addExam" || activePanal === "editExam" ? (
                <input
                  value={mcqTimer}
                  onChange={(e) => setMcqTimer(e.target.value)}
                  type="number"
                  placeholder="توقيت"
                />
              ) : null}
              <input
                value={mcqTitle}
                onChange={(e) => setMcqTitle(e.target.value)}
                type="text"
                placeholder="العنوان"
              />
              <input type="file" ref={questionImg} onChange={uploadFile} />
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
                {course.sections &&
                  course.sections.map((section) => {
                    return (
                      <>
                        <hr />
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
                          -- {section.title} --
                        </span>
                      </>
                    );
                  })}
                <hr />
                <span
                  onClick={() => {
                    setActivePanal("add_section");
                    setActiveCourse(course.id);
                  }}
                  style={{ cursor: "pointer", color: "var(--secondary-color)" }}
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
        <div className={admin.exams}>
          {exams.length ? (
            exams.map((exam, inx) => {
              return (
                <div className={admin.exam} key={exam.id}>
                  <div className={admin.upper_section}>
                    <p>{exam.title}</p>
                    <div>
                      <span
                        style={{ textAlign: "center" }}
                        onClick={async () => showExam(exam.id)}
                      >
                        {activeExam === exam.id ? "Hide" : "Show"}
                      </span>
                      <span
                        style={{ textAlign: "center", marginLeft: 20 }}
                        onClick={async () =>
                          await navigator.clipboard
                            .writeText(
                              `https://dr-ahmed-salama.com/exam/${exam.id}`
                            )
                            .then(Toast("تم النسخ"))
                        }
                      >
                        C
                      </span>
                    </div>
                  </div>
                  {activeExam === exam.id && (
                    <div className={admin.records}>
                      <span
                        onClick={() => {
                          editExam(inx);
                          window.scrollTo({
                            top: 50,
                            behavior: "smooth",
                          });
                        }}
                      >
                        تعديل الامتحان
                      </span>
                      {exam.records.map((record, inn) => {
                        return (
                          <div className={admin.record} key={inn}>
                            <p>{record.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>لا توجد امتحانات حتى الان.</p>
          )}
          <button
            onClick={() => {
              setActivePanal("addExam");
              window.scrollTo({
                top: 50,
                behavior: "smooth",
              });
            }}
          >
            اضافة امتحان
          </button>
        </div>
        <hr />
        <div className={admin.banned_users}>
          {banned.length ? (
            <>
              <p>الطلاب المحظورين</p>
              {banned.map((user, index) => {
                return (
                  <div className={admin.banned_user} key={index}>
                    <p>{user.name}</p>
                    <span onClick={() => unbanUser(user.id)}>فك</span>
                  </div>
                );
              })}
            </>
          ) : (
            <p>لا يوجد مستخدمون تحت الحظر</p>
          )}
        </div>
        <hr />
        <div className={admin.unapproved_users}>
          {unapproved.length ? (
            <>
              <p>الطلاب المعلقين</p>
              {unapproved.map((user, index) => {
                return (
                  <div className={admin.unapproved_user} key={index}>
                    <p>{user.name}</p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p>{user.year}</p>
                      <span
                        onDoubleClick={() => deleteUser(user.id, user.email)}
                        style={{
                          marginLeft: 20,
                          marginRight: 20,
                          backgroundColor: "red",
                          opacity: 0.7,
                        }}
                      >
                        X
                      </span>
                      <span onClick={() => approveUser(user.id)}>تم</span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p style={{ textAlign: "center" }}>لا يوجد مستخدمون معلقون</p>
          )}
        </div>
        <hr />
        <div className={admin.reset_device}>
          <p draggable>اعادة التعيين : </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              placeholder="الاميل : "
              ref={resetDeviceEmail}
            />
            <button onClick={handleFetchResetDevice}>بحث</button>
          </div>
          <div className={admin.reset_device_list} style={{ marginTop: 10 }}>
            {resetDevice.map((el) => {
              return (
                <div className={admin.reset_device_card} key={el.id}>
                  <span>{el.name}</span>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "2px 10px",
                      borderRadius: "5px",
                      marginRight: 20,
                    }}
                    onClick={() => handleResetDevice(el.id)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <hr />
        <div className={admin.users}>
          <div
            className={admin.users_header}
            style={{
              justifyContent: "center",
              gap: 20,
              backgroundColor: "transparent",
            }}
          >
            <button onClick={() => fetchUsers(2)}>2</button>
            <button onClick={() => fetchUsers(3)}>3</button>
          </div>
          {users.length ? (
            <>
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="اسم الطالب :"
                style={{ maxWidth: 300, margin: "auto" }}
              />
              <table style={{ display: "table" }} className={admin.users_list}>
                <tr>
                  <th>الاسم</th>
                  <th>الرقم</th>
                  <th>رقم ولي الامر</th>
                </tr>
                {searchUser
                  ? users.map(
                      (user) =>
                        user.name.includes(searchUser) && (
                          <tr
                            className={admin.user}
                            style={{
                              width: "fit-content",
                              textAlign: "center",
                              display: "table-row",
                            }}
                          >
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.parent_phone}</td>
                            <td>
                              <button
                                style={{
                                  backgroundColor: "red",
                                  padding: "7px 15px",
                                }}
                                onClick={() => deleteUser(user.id, user.email)}
                              >
                                X
                              </button>
                            </td>
                          </tr>
                        )
                    )
                  : users.map((user) => {
                      return (
                        <tr
                          className={admin.user}
                          style={{
                            width: "fit-content",
                            textAlign: "center",
                            display: "table-row",
                          }}
                        >
                          <td>{user.name}</td>
                          <td>{user.phone}</td>
                          <td>{user.parent_phone}</td>
                          <td>
                            <button
                              style={{
                                backgroundColor: "red",
                                padding: "7px 15px",
                              }}
                              onClick={() => deleteUser(user.id, user.email)}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      );
                    })}
              </table>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>اختار المرحلة</p>
          )}
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
            <div className="faqs_list">
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
