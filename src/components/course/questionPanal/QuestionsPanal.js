import React, { useEffect, useState } from "react";
import questionsPanal from "../course.module.css";
import Question from "./Question";
import Result from "./Result";
import supabase from "../../../Supabase";
import Toast from "../../toast/Toast";
import PrevAttempt from "./PrevAttempt";

function QuestionPanal({ data, courseId, elId, userId, sectionId }) {
  const [questions] = useState(data);
  const [i, setI] = useState(0);
  const [activePanal, setActivePanal] = useState("");
  const [newAttempt, setNewAttempt] = useState(false);
  const [fetchedPrevMcq, setFetchedPrevMcq] = useState({});
  const [showPrevAttemptResults, setShowPrevAttemptResults] = useState(false);

  const next = () => {
    if (i < questions.length - 1) {
      document
        .querySelectorAll(".answer")
        .forEach((answer) => (answer.className = "answer"));
      setI(i + 1);
    }
  };

  const updatePrevUserData = async (prevAttempt, selectedAnswers) => {
    let newPrevUserData = [
      {
        selectedAnswer: selectedAnswers,
        courseId: courseId.join("-"),
        sectionId: sectionId,
        elId: elId,
      },
    ];
    if (prevAttempt.length) {
      newPrevUserData = prevAttempt.concat(newPrevUserData);
    }
    await supabase
      .from("users")
      .update({
        prevMcqs: newPrevUserData,
      })
      .eq("id", userId.join("-"));

    setActivePanal("result");
  };
  const handleNewAttempt = () => {
    setNewAttempt(true);
    setActivePanal("questions");
  };
  const prev = () => {
    if (i > 0) {
      document
        .querySelectorAll(".answer")
        .forEach((answer) => (answer.className = "answer"));
      setI(i - 1);
    }
  };
  useEffect(() => {
    const fetchPrevMcqsFormUSer = async () => {
      await supabase
        .from("users")
        .select("prevMcqs")
        .eq("id", userId.join("-"))
        .then(async ({ data, error }) => {
          if (error) {
            Toast("حدث خطا ما");
            return;
          }
          if (data[0].prevMcqs.length) {
            let currentPrevMcq = data[0].prevMcqs.filter((prevMcq) => {
              return (
                prevMcq.courseId === courseId.join("-") &&
                prevMcq.elId === elId &&
                prevMcq.elId === elId
              );
            });
            if (currentPrevMcq.length) {
              setActivePanal("prevAttempt");
              setFetchedPrevMcq(currentPrevMcq[0]);
            } else {
              setActivePanal("questions");
            }
          } else {
            setActivePanal("questions");
          }
        });
    };

    fetchPrevMcqsFormUSer();
  }, [courseId, elId, userId]);

  const handleShowPrevAttemptResults = () => {
    setActivePanal("result");
    setShowPrevAttemptResults(true);
  };
  const submit = async () => {
    let selectedAnswers = [];
    // eslint-disable-next-line array-callback-return
    questions.map((el, inn) => {
      selectedAnswers[inn] = el.selectedAnswer;
    });
    await supabase
      .from("users")
      .select("prevMcqs")
      .eq("id", userId.join("-"))
      .then(async ({ data, error }) => {
        if (error) {
          Toast("حدث خطا ما");
          return;
        }
        if (data[0]) {
          if (newAttempt) {
            let newPrevMcqs = data[0].prevMcqs.filter((prevMcq) => {
              return (
                prevMcq.courseId !== courseId.join("-") &&
                prevMcq.elId !== elId &&
                prevMcq.sectioId !== sectionId
              );
            });
            updatePrevUserData(newPrevMcqs, selectedAnswers);
          } else {
            await supabase
              .from("users")
              .update([
                {
                  prevMcqs: [
                    {
                      sectionId: sectionId,
                      elId: elId,
                      courseId: courseId.join("-"),
                      selectedAnswer: selectedAnswers,
                    },
                  ],
                },
              ])
              .eq("id", userId.join("-"))
              .then(({ error }) => {
                if (!error) {
                  setActivePanal("result");
                } else {
                  Toast("حدث خطا ما");
                }
              });
          }
        } else {
          updatePrevUserData(data[0].prevMcqs, selectedAnswers);
        }
      });
  };

  return (
    <div className={questionsPanal.questions_panal}>
      {activePanal === "prevAttempt" ? (
        <>
          <PrevAttempt
            prevAttempt={fetchedPrevMcq}
            handleShowPrevAttemptResults={handleShowPrevAttemptResults}
          />
          <button className="primary_bt" onClick={handleNewAttempt}>
            اعادة المحاولة
          </button>
        </>
      ) : activePanal === "result" ? (
        <Result
          questions={data}
          courseId={courseId}
          elId={elId}
          sectionId={sectionId}
          showPrevAttemptResults={showPrevAttemptResults}
          prevAttemptAnswers={fetchedPrevMcq.selectedAnswer}
        />
      ) : (
        activePanal === "questions" && (
          <>
            <div className={questionsPanal.questions_indexs}>
              {data.map((qu, inn) => {
                return (
                  <span
                    key={inn}
                    onClick={() => setI(inn)}
                    style={{
                      backgroundColor: `${
                        inn === i ? "var(--primary-color)" : "#eee"
                      }`,
                      color: `${inn !== i ? "var(--primary-color)" : "#eee"}`,
                    }}
                  >
                    {inn + 1}
                  </span>
                );
              })}
            </div>
            <Question question={data[i]} inn={i + 1} length={data.length} />
            <div className={questionsPanal.bts}>
              {i > 0 && (
                <button className="primary_bt" onClick={prev}>
                  السابق
                </button>
              )}
              {i < questions.length - 1 && (
                <button className="primary_bt" onClick={next}>
                  التالي
                </button>
              )}
              {i === questions.length - 1 && (
                <button className="primary_bt" onClick={submit}>
                  تسليم
                </button>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default QuestionPanal;
