import React from 'react'
import { auth } from '@/auth'
import StartUpForm from '@/components/StartUpForm'
import { redirect } from 'next/navigation';

const page = async () => {
    const scession = await auth();
    if (!scession) redirect('/');

    return (
        <>
            <section className='pink_container'>
                <h1 className='heading'>Submit Your StartUp</h1>
            </section>
            <StartUpForm />
        </>
    )
}

export default page