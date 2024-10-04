import React, { useEffect } from "react";
import instance from "../../../../../config/axios";

const UpdateStudent = () => {
  useEffect(() => {
    (async () => {
      const response = await instance.get("admin/user-count");
      console.log(response.data);
    })();
  }, []);
  return <div>UpdateStudent</div>;
};

export default UpdateStudent;
