import pong from '@/app/pong/page'
import Link from 'next/link'
import React from 'react'

const links: { id: number; title: string; url: string }[] = [
  {
    id: 0,
    title: "home",
    url: "./home",
  },
  {
    id: 1,
    title: "pong",
    url: "./pong",
  },
  {
    id: 2,
    title: "chat",
    url: "./chat",
  },
  {
    id: 3,
    title: "leaderboard",
    url: "./leaderboard",
  },
];

const Navbar = () => {
  return (
    <div>
        {links.map(link=>
          <Link key={link.id} href={link.url}>{link.title}</Link>)             
        }      
    </div>
  )
}

export default Navbar