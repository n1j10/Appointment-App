"use client"

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import Api, { getMediaUrl } from '../_utils/Api'
import Image from 'next/image'
import Link from 'next/link'
function CategorySearch() {
    
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        getCategoryList()
    }, [])
    const getCategoryList = () => {
        Api.getCategory().then(resp => {
            setCategoryList(resp.data.data)
            console.log(resp.data.data)
        })
    }
    return (
        <div className='mb-10 items-center flex flex-col'>
            <h2 className='font-bold text-4xl mb-7 '><span className='text-blue-500'>Categories</span>   </h2>


            <div className='grid  md:grid-cols-3 sm:grid-cols-1 mt-8'>

                {categoryList.map((cat, index) => (
                    <Link href={`/search/${cat.name}`} key={index} className='flex flex-col text-center items-center p-5 bg-blue-100 m-2 rounded-lg hover:scale-110 transition-all ease-in-out cursor-pointer'>
                        <Image src={getMediaUrl(cat?.icon) ?? '/file.svg'}
                            width={70}
                            height={70}
                            alt={cat.name}
                        />
                        <label>{cat?.name}</label>

                    </Link>

                ))}
            </div>


            
        </div>
    )
}

export default CategorySearch
