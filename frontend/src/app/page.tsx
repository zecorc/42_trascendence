"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import type { NextPage } from "next";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  // const { data: session } = useSession()
  return (
    <div className={styles.container}>
      <div className={styles.item}>
          <Link href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b98e607513499274306cbad301d8f128ca766c93ff76ec8a049c9a5c0b1acc6a&redirect_uri=https%3A%2F%2F127.0.0.1&response_type=code">
            <button className={styles.button}>LOGIN 42</button>
          </Link>
          <Link href="/">
            <button className={styles.button}>LOGIN GOOGLE</button>
          </Link>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>DONE is better than PERFECT.</h1>
      </div>
    </div>
  );
}

{
  /* <div className={styles.signup}>
      {session && session.user ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </div> */
}
