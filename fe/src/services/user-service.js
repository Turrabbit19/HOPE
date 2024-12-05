import axios from "axios";
import instance from "../config/axios";

const createUser = async (data) => {
  return instance.post("/admin/officers", data);
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


const getMainMajor = async () => {
  return instance.get("/admin/main/majors");
};

const getListCourse = async () => {
  return instance.get("/admin/courses");
};

const getUser = async (id) => {
  return instance.get("/admin/officers/" + id);
};
const editAdmin = async (id, data) => {
  return instance.put("/admin/officers/" + id, data);
};
const editStudents = async (id, data) => {

  return instance.put("/admin/students/" + id, data);

};
const editTeachers = async (id, data) => {
  return instance.put("/admin/teachers/" + id, data);
};
const getStudent = async (id) => {
  return instance.get("/admin/students/" + id);
};
const getTeacher = async (id) => {
  return instance.get("/admin/teachers/" + id);
};
const deleteUser = async (id) => {
  return instance.delete("/admin/officers/" + id);
};
const deleteStudent = async (id) => {
  return instance.delete("/admin/students/" + id);
};
const deleteTeacher = async (id) => {
  return instance.delete("/admin/teachers/" + id);
};

export {
  createUser,
  getListMajor,
  getListCourse,
  getMainMajor,
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
  editAdmin,
  editStudents,
  editTeachers,
};
