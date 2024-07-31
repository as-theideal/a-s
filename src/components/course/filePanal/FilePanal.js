import React from "react";

function FilePanal({ data }) {
  return (
    <div style={{ padding: 20 }}>
      <a
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          margin: "auto",
          width: "fit-content",
          alignItems: "center",
        }}
        href={`https://storage.bunnycdn.com/as-files/${data.url}?accessKey=bf95e41d-8334-4927-a8e15ccbeca1-76ca-4545&download`}
      >
        <svg
          style={{ fill: "var(--text-color)" }}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z" />
        </svg>
        <p style={{ color: "var(--primary-color)", fontSize: 20 }}>
          {data.title}
        </p>
      </a>
    </div>
  );
}

export default FilePanal;
