import Image from "next/image";
import Link from 'next/link';


export default function Homepage()
{
    return(
        <div><h1> Home page</h1>
        <Link href="/pong">
          <button>Play PONGhete</button>
      </Link>
      </div>

    )
}
