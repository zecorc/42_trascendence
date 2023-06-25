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
          <Link href="https://localhost:8000/login">
            <button className={styles.button}>LOGIN 42</button>
          </Link>
          {/* INSERIRE login/42 */}
          <Link href="https://theuselessweb.com/">
            <button className={styles.button}>LOGIN GOOGLE</button>
          </Link>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>DONE is better than PERFECT.</h1>
      </div>
      {/* ONLY FOR TEST */}
      <div>
        <Link href="/home">
        <button className={styles.button}> GO TO HOME</button>
        </Link>
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
