import Form from 'next/form'
import SearchFormReset from './SearchFormReset';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchForm = async ({ query }: { query?: string }) => {

    return (
        <>
            <Form action="/" scroll={false} className='search-form'>
                <input type="text" name='query' defaultValue={query} className='search-input' placeholder='Search StartUps' />
                <div className='flex gap-2'>
                    {query && <SearchFormReset />}
                    <Button type='submit' className='search-btn text-white'>
                        <SearchIcon />
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SearchForm
