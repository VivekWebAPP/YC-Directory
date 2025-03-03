import React from 'react'
import Ping from './Ping';
import { client } from '@/sanity/lib/client';
import { noOfViews } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';
import { headers } from 'next/headers';

const View = async ({ id }: { id: string }) => {
    headers(); // This triggers the dynamic behavior
    const { views: totalView } = await client.withConfig({ useCdn: false }).fetch(noOfViews, { id }) || '0';

    await writeClient.patch(id).set({ views: totalView + 1 }).commit();

    return (
        <div className='view-container'>
            <div className='absolute -top-2 -right-2'>
                <Ping />
            </div>
            <p className='view-text'>
                <span className='font-black'>{totalView > 1 ? 'Views' : 'View'}: {totalView}</span>
            </p>
        </div>
    )
}

export default View;