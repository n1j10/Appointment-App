import axios from "axios";



const axiosGlobal = axios.create({
    baseURL: "http://localhost:1337/api"
})

const getCategory = () => axiosGlobal.get("/categories?populate=*")
const getDoctors = () => axiosGlobal.get("/doctors?populate=*")






const getDoctorsByCategory = (category) => axiosGlobal.get("/doctors?populate=*&filters[category][name][$contains]=" + category)


const getDoctorById = (documentId) => axiosGlobal.get("/doctors/" + documentId + "?populate=*")






const bookAppointment = async (data, token) => {
    console.log("bookAppointment payload ->", data, "token present:", !!token)
    try {
        const resp = await axiosGlobal.post("/appointments", data, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        console.log("bookAppointment response ->", resp?.data)
        return resp
    } catch (err) {
        console.error("bookAppointment error ->", err?.response?.data || err.message)
        throw err
    }
}

console.log("+++++bookAppointment++++++", bookAppointment)




const myBookingList = (email, token) => axiosGlobal.get("/appointments?filters[email][$eq]=" + email + "&populate[doctor][populate]=image", {
    headers: {
        Authorization: 'Bearer ' + token
    }
})



const deleteBooking = (documentId, token) => axiosGlobal.delete("/appointments/" + documentId, {
    headers: {
        Authorization: 'Bearer ' + token
    }
})




const registerUser = (username, email, password) => axiosGlobal.post("/auth/local/register",
    {
        username: username,
        email: email,
        password: password
    }).then((resp) => {
        return resp.data;
    })


const signInUser = (email, password) => axiosGlobal.post("/auth/local",
    {
        identifier: email,
        password: password
    }).then((resp) => {
        return resp.data;
    })



export default {
    getCategory,
    getDoctors,
    getDoctorsByCategory,
    getDoctorById,
    bookAppointment,
    myBookingList,
    deleteBooking,
    registerUser,
    signInUser

}
