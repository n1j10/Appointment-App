"use client"
import React, { useEffect, useState, use } from 'react'
import Api from '@/app/_utils/Api'
import DoctorDetails from '../_components/DoctorDetails'
import DoctorSuggestions from '../_components/DoctorSuggestions'


function Details({ params }) {
  const { id } = use(params)

  const [doctor, setDoctor] = useState()

  useEffect(() => {
    getDoctorById()
  }, [])

  const normalizeDoctor = (data) => {
    if (!data) return null

    const attrs = data.attributes ?? {}

    // Prefer already-flattened values while keeping ids/documentIds
    const base = { ...attrs, ...data }

    // Normalize media when Strapi returns image.data
    let image = data.image ?? attrs.image
    if (image?.data) {
      image = image.data.map((img) => {
        const imgAttrs = img.attributes ?? {}
        return { ...imgAttrs, url: imgAttrs.url }
      })
    }

    // Normalize category if present
    let category = base.category
    if (category?.data) {
      const catAttrs = category.data.attributes ?? {}
      category = { ...catAttrs, id: category.data.id }
    }

    const normalizedId = typeof (data.id ?? attrs.id) === 'string'
      ? Number(data.id ?? attrs.id)
      : (data.id ?? attrs.id)

    return {
      ...base,
      image,
      category,
      id: normalizedId,
      documentId: data.documentId ?? attrs.documentId,
    }
  }

  const getDoctorById = () => {
    Api.getDoctorById(id).then(resp => {
      const normalized = normalizeDoctor(resp.data.data)
      console.log("Doctor detail response (normalized)", normalized)
      setDoctor(normalized)
    })
  }
  return (
    <div className='p-5 md:px-20'>
      <h2 className='font-bold text-[22px]'>Details</h2>

      <div className='grid md:grid-cols-4 grid-cols-1'>

        {/* doctor details*/}
        <div className=' col-span-3 '>
          <DoctorDetails doctor={doctor} />

        </div>

        {/* doctor suggestions*/}
        <div>

          <DoctorSuggestions />
        </div>



      </div>
    </div>
  )
}

export default Details
