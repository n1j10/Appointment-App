import React, { useState, useEffect } from 'react'
import Api from '@/app/_utils/Api'
import Link from 'next/link'
import Image from 'next/image'
function DoctorSuggestions() {

  const [doctorList, setDoctorList] = useState([])
  
  useEffect(() => {
    getDoctorsList()
  }, [])

  const getDoctorsList = () => {
    Api.getDoctors().then(resp => {
      console.log("doctors", resp.data.data)
      setDoctorList(resp.data.data)
    })
  }

  return (
    <div className="p-3">
      <h1 className="text-lg font-semibold mb-4">Suggestions</h1>

      <div className="flex flex-col gap-3">
        {doctorList.slice(0, 5).map((doctor) => (
          <Link
            href={`/details/${doctor?.documentId}`}
            key={doctor?.documentId ?? doctor?.id}
            className="group"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">
              <Image
                src={doctor?.image?.[0]?.url ? `http://localhost:1337${doctor.image[0].url}` : '/doctor.png'}
                width={72}
                height={72}
                className="h-16 w-16 rounded-full object-cover"
                alt={doctor?.name || 'Doctor profile image'}
              />

              <div className="flex flex-col gap-1">
                <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700">
                  {doctor?.category?.name || 'General'}
                </span>
                <span className="text-sm font-semibold text-slate-900">{doctor?.name}</span>
                <span className="text-xs text-slate-600">
                  {doctor?.year_of_experience} years Experience
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

}

export default DoctorSuggestions
