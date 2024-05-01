import React, { useState } from "react";
import styles from "./Delete.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalContent } from "@nextui-org/modal";
import SpinnerWhite from "../SpinnerWhite/SpinnerWhite";
import { resetChat } from "@/store/chatSlice";
import { resetAISettings } from "@/store/aiSlice";
import { resetAuth, selectUserDetailsState } from "@/store/authSlice";
import {
  getAuth,
  deleteUser,
  reauthenticateWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  delete: () => void;
};

const Delete = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetailsState);
  const userID = userDetails?.uid;
  const [loading, setLoading] = useState(false);

  const deleteUserData = async (userId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await deleteUser(user);
      }

      const userRef = doc(db, "users", userId);
      const historyCollectionRef = collection(userRef, "history");
      const libraryCollectionRef = collection(userRef, "library");

      const historySnapshot = await getDocs(historyCollectionRef);
      const historyBatch = writeBatch(db);
      historySnapshot.forEach((doc) => {
        historyBatch.delete(doc.ref);
      });
      await historyBatch.commit();

      const librarySnapshot = await getDocs(libraryCollectionRef);
      const libraryBatch = writeBatch(db);
      librarySnapshot.forEach((doc) => {
        libraryBatch.delete(doc.ref);
      });
      await libraryBatch.commit();

      await deleteDoc(userRef);

      console.log("User data deleted successfully");
    } catch (error) {
      console.error("Error deleting user data:", error);
      throw error;
    }
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
        await deleteUserData(userID!);
        props.delete();
        props.onClose();
        dispatch(resetAISettings());
        dispatch(resetChat());
        dispatch(resetAuth());
        router.push("/");
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
      toast.error("Failed to delete!", {
        position: "top-center",
        style: {
          padding: "6px 18px",
          color: "#fff",
          background: "#FF4B4B",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"lg"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>Confirm Account Deletion</div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <p className={styles.text}>
                Before you delete your account, please be aware that:
              </p>
              <ul className={styles.ul}>
                <li className={styles.li}>
                  Your profile details, preferences, and settings will be
                  permanently removed.
                </li>
                <li className={styles.li}>
                  Your search history, threads, and any other content
                  you&apos;ve shared will be deleted and cannot be recovered.
                </li>
                <li className={styles.li}>
                  All data will be permanently erased 30 days after the account
                  deletion process is initiated.
                </li>
                <li className={styles.li}>
                  If you have an active Pro subscription, make sure to click
                  &apos;Manage Pro&apos; to cancel your subscription before
                  deleting your account.
                </li>
              </ul>
              <p className={styles.text}>
                Please remember that deleting your account is irreversible and
                cannot be undone.
              </p>
              {loading ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <SpinnerWhite />
                  </div>
                  <div className={styles.buttonText}>Deleting...</div>
                </div>
              ) : (
                <div className={styles.button} onClick={handleDelete}>
                  <div className={styles.buttonText}>Confirm</div>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Delete;
