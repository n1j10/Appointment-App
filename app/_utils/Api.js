import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:1337/api";

const normalizeApiBaseUrl = (value) => {
  if (typeof value !== "string") return DEFAULT_API_BASE_URL;

  const trimmedValue = value.trim();
  if (!trimmedValue) return DEFAULT_API_BASE_URL;

  return trimmedValue.replace(/\/+$/, "");
};

const stripApiSuffix = (value) => value.replace(/\/api\/?$/i, "");

const extractFirstMediaPath = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractFirstMediaPath(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === "object") {
    if (typeof value.url === "string") {
      return value.url;
    }

    if (value.attributes) {
      const foundInAttributes = extractFirstMediaPath(value.attributes);
      if (foundInAttributes) return foundInAttributes;
    }

    if (value.data) {
      const foundInData = extractFirstMediaPath(value.data);
      if (foundInData) return foundInData;
    }
  }

  return null;
};

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
export const STRAPI_ORIGIN = stripApiSuffix(API_BASE_URL);
export const DOCTOR_FALLBACK_IMAGE = "/doctor.svg";

export const getMediaUrl = (value) => {
  const mediaPath = extractFirstMediaPath(value);
  if (!mediaPath) return null;
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  return `${STRAPI_ORIGIN}${mediaPath.startsWith("/") ? "" : "/"}${mediaPath}`;
};



const axiosGlobal = axios.create({
  baseURL: API_BASE_URL,
});




const getCategory = () => axiosGlobal.get("/categories?populate=*");
const getDoctors = () => axiosGlobal.get("/doctors?populate=*");
const getDoctorsByCategory = (category) =>
  axiosGlobal.get(`/doctors?populate=*&filters[category][name][$contains]=${category}`);
const getDoctorById = (documentId) => axiosGlobal.get(`/doctors/${documentId}?populate=*`);

const bookAppointment = (data, token) =>
  axiosGlobal.post("/appointments", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const myBookingList = (email, token) =>
  axiosGlobal.get(`/appointments?filters[email][$eq]=${email}&populate[doctor][populate]=image`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const deleteBooking = (documentId, token) =>
  axiosGlobal.delete(`/appointments/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const registerUser = (username, email, password) =>
  axiosGlobal
    .post("/auth/local/register", {
      username,
      email,
      password,
    })
    .then((resp) => resp.data);

const signInUser = (email, password) =>
  axiosGlobal
    .post("/auth/local", {
      identifier: email,
      password,
    })
    .then((resp) => resp.data);

const Api = {
  getCategory,
  getDoctors,
  getDoctorsByCategory,
  getDoctorById,
  bookAppointment,
  myBookingList,
  deleteBooking,
  registerUser,
  signInUser,
};

export default Api;
