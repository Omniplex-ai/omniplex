"use client";

import React, { useEffect } from "react";
import styles from "@/styles/Home.module.css";
import MainPrompt from "../components/MainPrompt/MainPrompt";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setAuthState(true));
        dispatch(
          setUserDetailsState({
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            profilePic: user.photoURL ?? "",
          })
        );
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className={styles.main}>
      <MainPrompt />
    </div>
  );
};

export default Home;
