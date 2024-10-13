import instance from "../config/axios";

const createUser = async (data) => {
  return instance.post("/admin/users", data);
};

const createStudent = async (data) => {
  return instance.post("/admin/students", data);
};
const createTeacher = async (data) => {
  return instance.post("/admin/teachers", data);
};

const getListUser = async () => {
  return instance.get("/admin/users");
};

const getListStudent = async () => {
  return instance.get("/admin/students");
};

const getListMajor = async () => {
  return instance.get("/admin/majors");
};

const getListCourse = async () => {
  return instance.get("/admin/courses");
};

const getUser = async (id) => {
  return instance.get("/admin/users/" + id);
};
const getStudent = async (id) => {
  return instance.get("/admin/users/" + id);
};
const getTeacher = async (id) => {
  return instance.get("/admin/users/" + id);
};
const deleteUser = async (id) => {
  return instance.delete("/admin/users/" + id);
};
const deleteStudent = async (id) => {
  return instance.delete("/admin/users/" + id);
};
const deleteTeacher = async (id) => {
  return instance.delete("/admin/users/" + id);
};

export {
  createUser,
  getListMajor,
  getListCourse,
  getListUser,
  getListStudent,
  createStudent,
  createTeacher,
  getStudent,
  getTeacher,
  getUser,
  deleteStudent,
  deleteTeacher,
  deleteUser,
};
