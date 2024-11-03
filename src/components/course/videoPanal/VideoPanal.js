function VideoPanal({ data }) {
  return (
    <iframe
      title="video"
      src={`https://iframe.mediadelivery.net/embed/278372/${data.url}`}
      loading="lazy"
      style={{
        border: "none",
        maxWidth: "800px",
        width: "100%",
        aspectRatio: 16 / 9,
      }}
      autoplay={true}
      allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
      allowFullScreen={true}
    ></iframe>
  );
}

export default VideoPanal;
