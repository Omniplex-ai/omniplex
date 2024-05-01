import React, { useEffect, useState } from "react";
import styles from "./Library.module.css";
import Image from "next/image";
import Auth from "../Auth/Auth";
import SpinnerWhite from "../SpinnerWhite/SpinnerWhite";
import { Skeleton } from "@nextui-org/skeleton";
import { useDisclosure } from "@nextui-org/modal";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { getRelativeDateLabel, cutString } from "@/utils/utils";
import { LibraryItem } from "@/utils/types";
import { useSelector } from "react-redux";
import { selectAuthState, selectUserDetailsState } from "../../store/authSlice";
import {
  collection,
  query,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import Bin from "../../../public/svgs/Bin.svg";
import FolderInactive from "../../../public/svgs/sidebar/Folder_Inactive.svg";

const Library = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [libraryData, setLibraryData] = useState<LibraryItem[]>([]);

  useEffect(() => {
    fetchLibraryData();
  }, [isAuthenticated, userDetails.uid]);

  const fetchLibraryData = async () => {
    if (isAuthenticated && userDetails.uid) {
      setLoading(true);
      const libraryRef = collection(db, "users", userDetails.uid, "library");
      const q = query(libraryRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const library = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LibraryItem[];
      setLibraryData(library);
      setLoading(false);
    } else {
      setLibraryData([]);
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (isAuthenticated && userDetails.uid) {
      setDeleting(true);
      await deleteDoc(doc(db, "users", userDetails.uid, "library", itemId));
      fetchLibraryData();
      setDeleting(false);
    }
  };

  const handleAuth = () => {
    onOpen();
  };

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Documents</div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          {loading ? (
            <React.Fragment>
              <Skeleton className={styles.skeletonListHeader} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
              <Skeleton className={styles.skeletonListItem} />
            </React.Fragment>
          ) : libraryData.length === 0 ? (
            <div className={styles.emptyState}>
              <Image
                src={FolderInactive}
                alt="Folder Empty"
                className={styles.emptyStateIcon}
              />
              <p className={styles.emptyStateText}>No Documents Uploaded</p>
            </div>
          ) : (
            libraryData.map((item, index, array) => {
              const header =
                index === 0 || item.date !== array[index - 1].date ? (
                  <div key={`header-${index}`} className={styles.listHeader}>
                    {getRelativeDateLabel(item.date)}
                  </div>
                ) : null;
              return (
                <React.Fragment key={item.id}>
                  {header}
                  <div className={styles.listItem}>
                    {cutString(item.name, 24)}
                    {deleting ? (
                      <div className={styles.spinner}>
                        <SpinnerWhite />
                      </div>
                    ) : (
                      <Image
                        src={Bin}
                        alt="Bin"
                        className={styles.bin}
                        onClick={() => handleDelete(item.id)}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </ScrollShadow>
      {!isAuthenticated && (
        <div className={styles.modalOverlay}>
          <div className={styles.button} onClick={handleAuth}>
            Sign In
          </div>
        </div>
      )}
      <Auth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Library;
