import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link';

export default function Home()
{
  return (
    <div className={styles.container}>
      <Link href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b98e607513499274306cbad301d8f128ca766c93ff76ec8a049c9a5c0b1acc6a&redirect_uri=https%3A%2F%2F127.0.0.1&response_type=code">
      <button className={styles.button}>LOGIN 42</button>
      </Link>
    <div>
      <Link href="/">
        <button className={styles.button}>LOGIN GOOGLE</button>
      </Link>
    </div>
    </div>
  )
}
