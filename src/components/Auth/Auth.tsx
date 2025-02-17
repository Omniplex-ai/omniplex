// auth.tsx

import React, { useState } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@nextui-org/modal";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Spinner from "../Spinner/Spinner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Auth = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              email: user.email,
              name: user.displayName,
              profilePic: user.photoURL,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            email: user.email,
            name: user.displayName,
            profilePic: user.photoURL,
            createdAt: serverTimestamp(),
          },
        });
      }

      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          profilePic: user.photoURL ?? "",
        })
      );
      props.onClose();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"md"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.container}>
              <div className={styles.button} onClick={handleAuth}>
                <Image
                  src={"/svgs/Google.svg"}
                  alt={"Google"}
                  width={24}
                  height={24}
                />
                <div className={styles.buttonText}>Continue with Google</div>
              </div>
              <div className={styles.orDivider}>OR</div>
              <input
                type="email"
                placeholder="Enter your personal or work email"
                className={styles.emailInput}
              />
              <div className={styles.continueButton}>Continue with email</div>
              <div className={styles.terms}>
                By continuing, you agree to Omniplex's Consumer&nbsp;
                <a
                  href="https://omniplex.ai/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Terms
                </a>
                , and acknowledge their&nbsp;
                <a
                  href="https://omniplex.ai/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Auth;