import axios from "axios";

const API_URL =
  "http://localhost:5000/api/study-logs";


// ========================================
// GET STUDY LOGS
// ========================================

export const getStudyLogs = async () => {

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


// ========================================
// CREATE STUDY LOG
// ========================================

export const createStudyLog = async (
  logData
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.post(
      API_URL,
      logData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};


// ========================================
// DELETE STUDY LOG
// ========================================

export const deleteStudyLog = async (
  logId
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.delete(
      `${API_URL}/${logId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};