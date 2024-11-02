function VideoPanal({ data }) {
  return (
    <iframe
      title="video"
      src={`https://iframe.mediadelivery.net/play/278372/${data.url}`}
      loading="lazy"
      style={{
        border: "none",
        height: "65vh",
        width: "100%",
      }}
      allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
      allowFullScreen={true}
    ></iframe>
  );
}

export default VideoPanal;
