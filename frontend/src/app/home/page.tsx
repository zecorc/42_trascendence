import Image from "next/image";
import Link from 'next/link';
import styles from './page.module.css'


export default function Homepage()
{
    return(
        <div className={styles.container}>
          <h1>HOME</h1>
        <Link href="/pong">
          <button>GO TO /PONG</button>
      </Link>
      </div>

    )
}
