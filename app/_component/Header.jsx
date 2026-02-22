"use client"
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function Header() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  const syncUserFromStorage = useCallback(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
      return
    }
    setUser(null)
  }, [])

  useEffect(() => {
    syncUserFromStorage()
  }, [pathname, syncUserFromStorage])

  useEffect(() => {
    const handleAuthStateChange = () => syncUserFromStorage()
    window.addEventListener("auth-state-changed", handleAuthStateChange)

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange)
    }
  }, [syncUserFromStorage])

  const onLogout = () => {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("jwt")
    setUser(null)
    window.dispatchEvent(new Event("auth-state-changed"))
    router.push('/')
  }
  const Menu = [
    {
      id: 1,
      name: "Home",
      path: "/"
    },

    {
      id: 2,
      name: "Explore",
      path: "/explore"
    },

  ]

  return (
    <div className='flex items-center justify-between p-3 shadow-sm'>

      <div className='flex items-center gap-10'>
        <Image src={"/assets/imag/logo.png"}
          width={100}
          height={100}
          alt="logo"
        />


        <ul className=' md:flex gap-8 hidden'>
          {Menu.map((item, index) => (

            <Link href={item.path} key={index}>
              <li className='hover:text-blue-600 cursor-pointer hover:scale-105 transition-all'>{item.name}</li>

            </Link>
          ))}
        </ul>
      </div>









      {user ?


        <Popover>
          <PopoverTrigger >

            <Image
              src={'/assets/imag/logo.png'} // Use a default or placeholder if picture not available
              width={50}
              height={50}
              alt='user'
              className="rounded-full"
            />

          </PopoverTrigger>
          <PopoverContent className="w-45 flex flex-col ">
            <ul>
              <li className='mt-2 cursor-pointer hover:bg-blue-300 p-2'>My Profile</li>
              <Link href={"/my-booking"} className='mt-2 cursor-pointer hover:bg-blue-300 p-2'>My Booking</Link>
              <li className='mt-2 cursor-pointer hover:bg-blue-300 p-2' onClick={onLogout}>
                Logout
              </li>
            </ul>
          </PopoverContent>
        </Popover>

        :
        
        <Link href={'/sign-in'}>
          <Button>Get Started</Button>
        </Link>
      }



    </div>
  )
}

export default Header
