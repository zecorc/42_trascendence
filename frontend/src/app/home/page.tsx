import Image from "next/image";
import Link from 'next/link';


export default function Homepage()
{
    return(
        <div>
          <h1>HOME</h1>
        <Link href="/pong">
          <button>GO TO /PONG</button>
      </Link>
      </div>

    )
}
