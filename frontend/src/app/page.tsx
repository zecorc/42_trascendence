"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
// import {Button} from "primereact/button";
import { Button } from "@mantine/core";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import  'primereact/resources/primereact.min.css';
import  'primeicons/primeicons.css';
import  'primeflex/primeflex.css';

import type { NextPage } from "next";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  // const { data: session } = useSession()
  return (
    <div className={styles.container}>
      <div className={styles.item}>
          <Link href="https://localhost:8000/login">
            <Button radius="xl" size="lg" uppercase className={styles.button}>LOGIN 42</Button>
          </Link>
          {/* INSERIRE login/42 */}
          {/* <Link href="https://theuselessweb.com/">
            <Button className={styles.button}>LOGIN GOOGLE</Button>
          </Link> */}
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>DONE is better than PERFECT.</h1>
      </div>
      {/* ONLY FOR TEST */}
      <div>
        <Link href="/home">
        <Button className={styles.button}> GO TO HOME</Button>
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
