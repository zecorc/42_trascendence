"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import { Button } from "@mantine/core";


const links: { id: number; title: string; url: string }[] = [
  {
    id: 0,
    title: "HOME",
    url: "./home",
  },
  {
    id: 1,
    title: "PONG",
    url: "./pong",
  },
  {
    id: 2,
    title: "CHAT",
    url: "./chat",
  },
  {
    id: 3,
    title: "LEADERBOARD",
    url: "./leaderboard",
  },
];

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
      <Link href="/" className={styles.logo}>
        PROFILE
      </Link>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <Link className={styles.link} key={link.id} href={link.url}>
            {link.title}
          </Link>
        ))}
        <Button
          className={styles.logout}
          onClick={() => {
            console.log("logged out");
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
