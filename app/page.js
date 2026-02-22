"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import Hero from "./_component/Hero";
import CategorySearch from "./_component/CategorySearch";
import DoctorList from "./_component/DoctorList";
import Api from "./_utils/Api";
import { useEffect, useState } from "react";

export default function Home() {

  const [doctorList, setDoctorList] = useState([])
  useEffect(()=>{
    getDoctorsList()
  },[])



  const getDoctorsList=()=>{
    Api.getDoctors().then(resp =>{
      console.log("doctors",resp.data.data)
      setDoctorList(resp.data.data)
    })
  }
  

  return (
    <div >
      <Hero/>
      <CategorySearch/>
      <DoctorList doctorList={doctorList}/>

     
    </div>
  );
}
