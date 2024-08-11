function Faqs({ faqs }) {
  return (
    <div className="faqs" style={{ padding: 10 }}>
      <div
        className="faqs_list"
        style={{ overflowY: "overlay", maxHeight: "fit-content" }}
      >
        {faqs.map((faq, inn) => (
          <div
            key={inn}
            className="faq"
            style={{ paddingLeft: `${faq.answer && "40px"}` }}
          >
            <p>س : {faq.question}</p>

            {faq.answer ? (
              <p>ا : {faq.answer}</p>
            ) : (
              <p>لم يتم الاجابة بعد .....</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faqs;
