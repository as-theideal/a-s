function VideoPanal({ data }) {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        title="video"
        src={`https://iframe.mediadelivery.net/play/278372/${data.url}`}
        loading="lazy"
        style={{
          border: "none",
          position: "absolute",
          top: 0,
          height: "100%",
          width: "100%",
        }}
        allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
        allowfullscreen="true"
      ></iframe>
    </div>
  );
}

export default VideoPanal;
