"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import Api from '@/app/_utils/Api'
import { toast } from "sonner"
import { format } from 'date-fns'






function BookAppointment({ doctor }) {
  const [date, setDate] = useState(new Date())
  const [timeSlot, setTimeSlot] = useState([])

  const [selectedTime, setSelectedTime] = useState()
  const [user, setUser] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState("")

  const getUserData = useCallback(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  const getTime = useCallback(() => {
    const timeList = []
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" })
      timeList.push({ time: i + ":30 AM" })
    }
    for (let i = 1; i <= 5; i++) {
      timeList.push({ time: i + ":00 PM" })
      timeList.push({ time: i + ":30 PM" })
    }
    setTimeSlot(timeList)
  }, [])

  useEffect(() => {
    getTime();
    getUserData();
  }, [])

  const parseDoctorId = () => {
    if (doctor?.id !== undefined && doctor?.id !== null) return Number(doctor.id)
    if (doctor?.documentId !== undefined && doctor?.documentId !== null) {
      const maybeNum = Number(doctor.documentId)
      return maybeNum
    }
    return NaN
  }

  const hasDoctorId = parseDoctorId() !== null

  const to24hTime = (label) => {
    if (!label) return ""
    try {
      const [timePart, modifier] = label.split(" ")
      const [rawH, rawM] = timePart.split(":")
      let h = parseInt(rawH, 10)
      const m = parseInt(rawM, 10)
      if (modifier?.toUpperCase() === "PM" && h !== 12) h += 12
      if (modifier?.toUpperCase() === "AM" && h === 12) h = 0
      const hh = String(h).padStart(2, "0")
      const mm = String(m).padStart(2, "0")
      return `${hh}:${mm}:00`
    } catch (e) {
      return label
    }
  }

  const booking = async () => {
    if (!user) {
      toast("Please login first to book an appointment");
      return;
    }

    const token = sessionStorage.getItem('jwt');
    if (!token) {
      toast("Session expired. Please login again.");
      return;
    }

    console.log("Booking doctor object:", doctor);
    const doctorIdRaw = parseDoctorId();
    if (Number.isNaN(doctorIdRaw)) {
      setErrorText("Doctor information is missing; please refresh the page.");
      toast("Unable to book: doctor info missing.");
      return;
    }
    const doctorId = doctorIdRaw

    const userName =
      user?.username ||
      [user?.given_name, user?.family_name].filter(Boolean).join(" ").trim() ||
      user?.name ||
      user?.email ||
      "Unknown User"

    const userEmail = user?.email || user?.username || ""

    setIsSubmitting(true);
    setErrorText("");

    const formattedDate = format(date, "yyyy-MM-dd");
    const formattedTime = to24hTime(selectedTime);

    const payload = {
      data: {
        userName,
        email: userEmail,
        date: formattedDate,
        time: formattedTime,
        doctor: doctorId,
      }
    };

    console.log("Submitting appointment payload", payload);

    try {
      const resp = await Api.bookAppointment(payload, token);
      console.log("Booking Response SUCCESS:", resp);
      if (resp) {
        toast("Appointment Booked Successfully.");
        setErrorText("");
      }
    } catch (err) {
      console.error("Booking Error Object:!!!!!!", err);
      console.error("Booking Error Response Data:@@@@@", err.response?.data);
      console.error("Booking Error Status:", err.response?.status);

      const errorMsg = err.response?.data?.error?.message || `Unable to book; please try again. (status ${err.response?.status ?? 'n/a'})`;
      setErrorText(errorMsg);
      toast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 rounded-full">Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-5'>
              <div className='flex flex-col items-baseline gap-3'>
                <h2 className='mb-2'>Select Date</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  className="rounded-md border"
                  disabled={isPastDay}
                />
              </div>
              <div className='mt-5 md:mt-0'>
                <h2 className='mb-2'>Select Time Slot</h2>
                <div className='grid grid-cols-3 gap-3 border rounded-lg p-3'>
                  {timeSlot?.map((item, index) => (
                    <h2
                      key={index}
                      onClick={() => setSelectedTime(item.time)}
                      className={`border text-center hover:bg-primary hover:text-white cursor-pointer p-2 rounded-full transition-all
                                            ${item.time === selectedTime ? "bg-primary text-white" : ""}`}
                    >
                      {item.time}
                    </h2>
                  ))}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-3'>
          <Button
            onClick={() => booking()}
            disabled={!(date && selectedTime) || isSubmitting || !hasDoctorId}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </Button>
          {errorText && (
            <span className="text-xs text-red-500 self-center">{errorText}</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookAppointment
