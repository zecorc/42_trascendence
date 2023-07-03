"use client";

// import React from "react";
import styles from "./page.module.css";
import { Divider, Avatar, Button, Input } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import React, { useState } from "react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Avatar size={120} src="/path/to/profile-image.jpg" />
        {/* </div> */}
        {/* <div className={styles.name}> */}
          <h2>NickName</h2>
        </div>
      </div>
      <div className={styles.content}>
        <form className={styles.form}>
          <Divider size="xl" />
          <div className={styles.group}>
            <label htmlFor="nickname">Nickname:</label>
            <Input
              type="text"
              id="nickname"
              readOnly
              defaultValue="Nickname Utente"
              disabled
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="city">Città:</label>
            <Input
              type="text"
              id="city"
              readOnly
              defaultValue="Nome Città"
              disabled
            />
          </div>
          {/* ... altri campi del form ... */}
        </form>
        <div className={styles.buttoncontainer}>
          <Button className={styles.editbutton} onClick={handleEditClick}>
            {isEditing ? "Salva" : "Modifica"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
