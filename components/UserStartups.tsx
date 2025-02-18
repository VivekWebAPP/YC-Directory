import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import StartupCard from './StartupCard';

const UserStartups = async ({ id }: { id: string }) => {
    const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
    return (
        <>
            {startups.length > 0 ? startups.map((StartupCardType: any) => (
                <StartupCard key={StartupCardType._id} post={StartupCardType} />
            )) : <p>No startups found</p>}
        </>
    )
}

export default UserStartups;


