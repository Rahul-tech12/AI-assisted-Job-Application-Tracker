import axios from "axios";

const API_URL = process.env.BASE_URL;

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

export const updateApplication = async (id: string, data: any) => {
  const res = await axios.put(
    `${API_URL}/applications/${id}`,
    data,
    getHeaders()
  );
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await axios.delete(
    `${API_URL}/applications/${id}`,
    getHeaders()
  );
  return res.data;
};

