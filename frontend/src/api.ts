import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getHeaders = () => ({
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
});

export const createApplication = async (jd: string) => {
  const res = await axios.post(
    `${API_URL}/applications/add`,
    { jd },
    getHeaders()
  );
  return res.data;
};

export const getApplications = async () => {
  const res = await axios.get(
    `${API_URL}/applications`,
    getHeaders()
  );
  return res.data;
};

