"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Api from '@/app/_utils/Api'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
const CreateAccount = () => {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt")
        if (jwt) {
            router.push("/")
        }
    }, [])

    const onCreateAccount = (e) => {
        e.preventDefault()
        Api.registerUser(username, email, password).then((resp) => {
            console.log(resp.user)
            console.log(resp.jwt)

            
            sessionStorage.setItem("user", JSON.stringify(resp.user))
            sessionStorage.setItem("jwt", resp.jwt)
            window.dispatchEvent(new Event("auth-state-changed"))
            toast("Account created successfully.")
            router.replace("/")
            //! save in bowser
            // localStorage.setItem("user", JSON.stringify(resp.user))
            // localStorage.setItem("jwt", resp.jwt)
        },
            (e) => {
                toast("Failed while creating account.")
            }
        )
    }

    return (
        <div>

            <div className='flex justify-center items-baseline m-20'>
                <div className='flex flex-col items-center gap-5 bg-gray-100 w-[450px] p-5'>

                    <Image src='/assets/imag/logo.png' width={200} height={200} unoptimized={true} alt='logo' />
                    <h2 className='font-bold text-2xl text-amber-500 '>Create New Account</h2>
                    <form onSubmit={onCreateAccount} className='flex flex-col w-full gap-5'>
                        <Input onChange={(e) => setUsername(e.target.value)} className="bg-white" type="text" placeholder='Username' />
                        <Input onChange={(e) => setEmail(e.target.value)} className="bg-white" type="email" placeholder='Email' />
                        <Input onChange={(e) => setPassword(e.target.value)} className="bg-white" type="password" placeholder='Password' />
                        <Button disabled={!(username.length > 0 && username.length <= 10 && email.length > 0 && email.length < 15 && password.length > 0 && password.length < 15)}
                            type="submit">Sign Up</Button>

                        <p>Already have an account? <Link className='text-blue-500 font-bold' href="/sign-in">Sign In</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount
