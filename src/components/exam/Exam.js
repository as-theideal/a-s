import { useEffect, useRef, useState } from "react";
import exam from "./exam.module.css";
import result from "../course/course.module.css";
import supabase from "../../Supabase";
import Toast from "../toast/Toast";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function Exam() {
  const [examData, setData] = useState();
  const [timer, setTimer] = useState();
  const name = useRef();
  const examId = useRef();
  const abcd = ["ا", "ب", "ج", "د"];
  const [state, setState] = useState(false);

  useEffect(() => {
    examId.current = window.location.pathname.split("/")[2];
    supabase
      .from("exams")
      .select("title,questions,timer")
      .eq("id", examId.current)
      .then(({ error, data }) => {
        if (error) {
          Toast(error.message);
          return;
        }
        setData({
          ...data[0],
        });
        setTimer(data[0].timer);
      });
  }, []);
  const handleSubmit = async () => {
    name.current.value
      ? await supabase
          .from("exams")
          .select("records")
          .eq("id", examId.current)
          .then(
            async ({ data }) =>
              await supabase
                .from("exams")
                .update({
                  records: [
                    ...data[0].records,
                    {
                      name: name.current.value,
                      time: timer,
                      selectedAnswers: examData.questions.map(
                        (el) => el.selectedAnswer
                      ),
                    },
                  ],
                })
                .eq("id", examId.current)
                .then(({ error }) => {
                  if (error) {
                    Toast(error.message);
                    return;
                  }
                  Toast("تم التسليم");
                  setState(true);
                })
          )
      : Toast("تأكد من كتابة اسمك رباعي");
  };
  const handleSelect = (inx, e) => {
    document
      .getElementsByName(inx)
      .forEach((answer) => (answer.className = "answer"));
    e.target.className = "answer selected_answer";

    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((el, inn) =>
        inn === inx ? { ...el, selectedAnswer: +e.target.id } : el
      ),
    }));
  };
  return (
    examData &&
    (!state ? (
      <div className={exam.exam}>
        <div className={exam.timer}>
          <CountdownCircleTimer
            isPlaying
            duration={examData.timer * 60}
            colors={["#39b68a", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[7, 5, 2, 0]}
            size={100}
            strokeWidth={10}
            onComplete={handleSubmit}
            onUpdate={(remainingTime) =>
              remainingTime / 60 === +(remainingTime / 60).toFixed(0) &&
              setTimer(remainingTime / 60)
            }
          >
            {({ remainingTime }) =>
              ~~(remainingTime / 60) + " : " + (remainingTime % 60)
            }
          </CountdownCircleTimer>
        </div>
        <hr />
        <input type="text" placeholder="الاسم رباعي : " ref={name} />

        {examData.questions.map((question, inx) => {
          return (
            <div className={exam.question} key={inx}>
              {+question.question ? (
                <img
                  src={`https://sqbvwnxsbocvrdxbpsfu.supabase.co/storage/v1/object/public/courses_questions_imgs/${question.question}`}
                  alt=""
                />
              ) : (
                <h1>
                  {inx} : {question.question}
                </h1>
              )}
              <div className={exam.answers}>
                {question.answers.map((answer, inn) => {
                  return (
                    <div
                      name={inx}
                      id={inn}
                      onClick={(e) => handleSelect(inx, e)}
                      className={`${
                        Object.keys(question).includes("selectedAnswer")
                          ? question.selectedAnswer === inn
                            ? "answer selected_answer"
                            : "answer"
                          : "answer"
                      }`}
                      key={inn}
                    >
                      {abcd[inn]} : {answer}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button onClick={handleSubmit}>تسليم</button>
      </div>
    ) : (
      <Result examId={examId.current} questions={examData.questions} />
    ))
  );
}

function Result({ questions, examId }) {
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [correctSelection, setCorrectSelecteion] = useState(0);
  const [wrongSelection, setWrongSelection] = useState(0);
  useEffect(() => {
    supabase
      .from("exams")
      .select("correct_answers")
      .eq("id", examId)
      .then(({ data, error }) => {
        if (error) {
          Toast(error.message);
          return;
        }
        setCorrectAnswers(data[0].correct_answers);

        data[0].correct_answers.map((correctAnswer, inn) => {
          if (correctAnswer === questions[inn].selectedAnswer) {
            setCorrectSelecteion((prev) => prev + 1);
          } else {
            setWrongSelection((prev) => prev + 1);
          }
        });
      });
  }, []);
  return (
    questions && (
      <div
        className={result.result_panal}
        style={{ marginTop: 100, paddingBottom: 50 }}
      >
        <h1 className={result.per}>
          {Math.trunc((correctSelection / correctAnswers.length) * 100)}%
        </h1>
        <div
          className={result.selected_answers_num}
          style={{
            flexDirection: `${window.innerWidth < 450 && "column"}`,
            gap: 10,
          }}
        >
          <div
            className={result.correct_selection_num}
            style={{ padding: 10, justifyContent: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
            <p>الاجابات الصحيحة : {correctSelection}</p>
          </div>
          <div
            className={result.wrong_selection_num}
            style={{ padding: 10, justifyContent: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
            </svg>
            <p>الاجابات الخاطئة : {wrongSelection}</p>
          </div>
        </div>
        <hr />
        <div
          className={result.answers_section}
          style={{ overflow: "visible", height: "fit-content" }}
        >
          {correctAnswers.map((correctAnswer, inn) => {
            if (correctAnswer === questions[inn].selectedAnswer) {
              return (
                <div
                  key={inn}
                  className={result.card}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    opacity: 0.7,
                  }}
                >
                  <p>
                    {inn + 1} : {questions[inn].question}
                  </p>
                  <div className={result.correct_selection}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                    <p>{questions[inn].answers[correctAnswer]}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={inn}
                  className={result.card}
                  style={{ backgroundColor: "#ff0000d9" }}
                >
                  <p>
                    {inn + 1} : {questions[inn].question}
                  </p>
                  <div className={result.wrong_selection}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
                    </svg>
                    <p>
                      {questions[inn].answers[questions[inn].selectedAnswer]}
                    </p>
                  </div>
                  <div className={result.correct_selection}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                    <p>{questions[inn].answers[correctAnswer]}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    )
  );
}

export default Exam;
