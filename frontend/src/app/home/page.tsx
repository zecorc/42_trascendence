"use client";

import Image from "next/image";
import Link from 'next/link';
import styles from './page.module.css'
// import { Button } from "primereact/button";
import { Button } from "@mantine/core";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import  'primereact/resources/primereact.min.css';
import  'primeicons/primeicons.css';
import  'primeflex/primeflex.css';

export default function Homepage()
{
    return(
        <div className={styles.container}>
          <h1>HOME</h1>
        <Link href="/pong">
          <Button>GO TO /PONG</Button>
      </Link>
      </div>

    )
}
