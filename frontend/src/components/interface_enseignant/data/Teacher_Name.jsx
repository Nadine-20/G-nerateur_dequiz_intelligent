import React, { useEffect, useState } from "react";

const TeacherName = ({ teacher_id }) => {
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    if (!teacher_id) return;

    fetch(`http://localhost:5000/api/teacher_name/${teacher_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setFullname(data.fullname);
      })
      .catch((error) => {
        console.error("Error fetching teacher name:", error);
      });
  }, [teacher_id]);

  return <div style={{ color: "black",display:"inline" }}>{fullname}</div>;
};

export default TeacherName;
