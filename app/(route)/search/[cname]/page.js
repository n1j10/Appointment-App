"use client"
import DoctorList from '@/app/_component/DoctorList'
import Api from '@/app/_utils/Api'
import React, { useEffect, useState, use } from 'react'

function Search({ params }) {
  const { cname } = use(params)
  const [doctorList, setDoctorList] = useState([])

  useEffect(() => {
    console.log(cname)
    getDoctors()
  }, [cname])

  const getDoctors = () => {
    Api.getDoctorsByCategory(cname).then(resp => {
      console.log("doctors by category", resp.data.data)
      setDoctorList(resp.data.data)
    })
  }

  return (
    <div>
      <DoctorList doctorList={doctorList} heading={cname} />
    </div>
  )
}

export default Search