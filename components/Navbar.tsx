import logo from '../public/logo.png'
import Link from 'next/link';
import Image from 'next/image';
import { auth, signIn, signOut } from '@/auth';
import { Author, Startup } from '@/sanity/types';
import { Badge, BadgePlus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


export type StartupTypeCard = Omit<Startup, 'author'> & { author?: Author };

const Navbar = async () => {
  const scession = await auth();

  return (
    <div className="px-5 py-2 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src={logo} alt="logo" height={30} width={144} />
        </Link>
        <div className='flex items-center gap-5 text-black'>
          {scession && scession?.user ? (
            <>
              <Link href="/startup/create">
                <span className='max-sm:hidden'>Create</span>
                <BadgePlus className='size-6 sm:hidden text-red-500' />
              </Link>
              <form action={async () => {
                'use server'
                await signOut({ redirectTo: '/' });
              }}>
                <button type='submit'>
                  <span className='max-sm:hidden'>Logout</span>
                  <LogOut className='size-6 sm:hidden text-red-500' />
                </button>

              </form>
              <Link href={`/user/${scession?.id}`}>
                <Avatar className='size-10'>
                  <AvatarImage src={scession?.user?.image || ""} alt={scession?.user?.name || ""} />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form action={async () => {
              'use server'
              await signIn('github')
            }}>
              <button type='submit'>
                <span>Login</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
