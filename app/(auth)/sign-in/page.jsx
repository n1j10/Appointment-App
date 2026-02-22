"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Api from "@/app/_utils/Api"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'



const SignIn = () => {
    // const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    useEffect(() => {
        const jwt = sessionStorage.getItem("jwt")
        if (jwt) {
            router.push("/")
        }
    }, [])

    const onSignIn = async (e) => {
        e.preventDefault()

        try {
            const resp = await Api.signInUser(email, password)
            console.log(resp.user)
            console.log(resp.jwt)
            sessionStorage.setItem("user", JSON.stringify(resp.user))
            sessionStorage.setItem("jwt", resp.jwt)
            window.dispatchEvent(new Event("auth-state-changed"))
            toast("Signed In Successfully.")
            router.replace("/")
        } catch (e) {
            toast("Error while SignIn .")
        }

        console.log(email, password)
    }
    return (
        <div>
            <div className='flex justify-center items-baseline m-20'>
                <div className='flex flex-col items-center gap-5 bg-gray-100 w-[450px] p-5'>

                    <Image src='/assets/imag/logo.png' width={200} height={200} unoptimized={true} alt='logo' />
                    <h2 className='font-bold text-2xl text-amber-500 '>Sign In</h2>
                    <form onSubmit={onSignIn} className='flex flex-col w-full gap-5'>
                        <Input onChange={(e) => setEmail(e.target.value)} className="bg-white" type="email" placeholder='Email' />
                        <Input onChange={(e) => setPassword(e.target.value)} className="bg-white" type="password" placeholder='Password' />
                        <Button disabled={!(email.length > 0 && email.length < 20 && password.length > 0 && password.length < 20)}
                            type="submit">Sign In</Button>

                        <p>Don't have an account? <Link className='text-blue-500 font-bold' href="/create-account">Create Account</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn
