import axios from "axios";

const API_URL =
  "http://localhost:5000/api/tasks";


export const getTasks = async () => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.get(
      API_URL,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};


export const createTask = async (
  taskData
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.post(
      API_URL,
      taskData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};


export const completeTask = async (
  taskId
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.put(
      `${API_URL}/${taskId}`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};


export const deleteTask = async (
  taskId
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.delete(
      `${API_URL}/${taskId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};