"use client";

import pong from "@/app/pong/page";
import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";

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
      <Link href="/" className={styles.logo}>
        USER
      </Link>
      <div className={styles.links}>
        </div>
        {links.map((link) => (
          <Link className={styles.link} key={link.id} href={link.url}>
            {link.title}
          </Link>
        ))}
      <button
        className={styles.logout}
        onClick={() => {
          console.log("logged out");
        }}
        >
        Log out
      </button>
        </div>
  );
};

export default Navbar;
