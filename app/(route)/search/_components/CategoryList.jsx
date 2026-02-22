"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Api from '@/app/_utils/Api'
import Image from 'next/image'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

function CategoryList() {
  const [categoryList, setCategoryList] = useState([])
  const router = useRouter()

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
    <div className='h-screen flex flex-col mt-5'>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Suggestions">
            {categoryList?.map((cat, index) => (
              <CommandItem
                key={index}
                className="cursor-pointer"
                onSelect={() => {
                  router.push(`/search/${cat.name}`)
                }}
              >
                <div className='p-2 flex gap-2 w-full items-center'>
                  <Image
                    src={`http://localhost:1337${cat?.icon[0]?.url}`}
                    width={30}
                    height={30}
                    alt={cat?.name}
                  />
                  <label className="cursor-pointer">{cat?.name}</label>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default CategoryList