import React from "react";
import styles from "./Plugins.module.css";
import Image from "next/image";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";

const Plugins = () => {
  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Plugins</div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          <div className={styles.emptyState}>
            <Image
              src={PluginInactive}
              alt="Plugin Empty"
              className={styles.emptyStateIcon}
            />
            <p className={styles.emptyStateText}>
              Build your own plugin. Coming Soon!
            </p>
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
};

export default Plugins;
