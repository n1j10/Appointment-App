import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
function DoctorList({ doctorList, heading = "Popular Doctors" }) {
  return (
    <div className='px-2 sm:px-0'>
      <h2 className='font-bold text-xl text-blue-600'>{heading}</h2>
      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3'>




        
        {doctorList?.length > 0 ? doctorList?.map((doctor, index) => (
          <Link href={`/details/${doctor?.documentId}`} key={doctor?.documentId ?? index} className='block h-full'>
            <Card className='h-full overflow-hidden border-blue-100 p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
              <Image
                src={doctor?.image?.[0]?.url ? `http://localhost:1337${doctor?.image?.[0]?.url}` : 'https://cdn-icons-png.flaticon.com/512/3138/3138275.png'}
                width={600}
                height={320}
                className='h-52 w-full object-cover sm:h-60'
                alt={doctor?.name || 'Doctor image'}
              />

              <CardHeader className='space-y-3 px-4 pt-4 pb-0 sm:px-5'>
                <p className='w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700'>
                  {doctor?.category?.name || 'General'}
                </p>
                <CardTitle className='text-lg font-semibold text-slate-900'>
                  {doctor?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 px-4 pb-0 text-sm text-00 sm:px-5'>
                <p>
                  <span className='font-semibold text-blue-600'>Experience:</span>{' '}
                  {doctor?.year_of_experience} years
                </p>
                <p className='break-words'>
                  <span className='font-semibold text-blue-600'>Address:</span>{' '}
                  {doctor?.address}
                </p>
                <p>
                  <span className='font-semibold text-blue-600'>Phone:</span>{' '}
                  {doctor?.phone}
                </p>
              </CardContent>
              <CardFooter className='px-4 pt-4 pb-4 sm:px-5'>
                <Button asChild className='w-full'>
                  <span>Book Now</span>
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))
          :
          [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className='h-[340px] animate-pulse rounded-xl bg-slate-100'></div>
          ))
        }
      </div>
    </div>
  )
}
export default DoctorList
