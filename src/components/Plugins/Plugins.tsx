import React from "react";
import styles from "./Plugins.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/modal";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";
import { PLUGINS } from "@/utils/data";

import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";

interface Plugin {
  tag: string;
  name: string;
  comingSoon: boolean;
  url: string;
  icon?: React.ReactNode;
  description: string;
}

const groupByTag = (plugins: Plugin[]) => {
  return plugins.reduce((acc, plugin) => {
    if (!acc[plugin.tag]) {
      acc[plugin.tag] = [];
    }
    acc[plugin.tag].push(plugin);
    return acc;
  }, {} as Record<string, Plugin[]>);
};

const Plugins = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector(selectAuthState);
  const handleAuth = () => {
    onOpen();
  };

  const groupedPlugins = groupByTag(PLUGINS);

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Plugins</div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          {Object.keys(groupedPlugins).map((tag) => (
            <React.Fragment key={tag}>
              <div key={`header-${tag}`} className={styles.listHeader}>
                {tag}
              </div>
              {groupedPlugins[tag].map((item, index) => (
                <div
                  key={index}
                  className={styles.listItem}
                  style={{ opacity: item.comingSoon ? 0.75 : 1 }}
                  onClick={() => router.push(item.url)}
                >
                  <div className={styles.listIconContainer}>
                    {/* <Image
                      src={PluginInactive}
                      alt="Plugin Icon"
                      className={styles.listIcon}
                    /> */}
                    <Image
                      src={item.icon ?? PluginInactive}
                      alt="Plugin Icon"
                      className={styles.listIcon}
                    />
                  </div>
                  <div className={styles.listItemText}>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.description}>{item.description}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* <div className={styles.emptyState}>
            <Image
              src={PluginInactive}
              alt="Plugin Empty"
              className={styles.emptyStateIcon}
            />
            <p className={styles.emptyStateText}>
              Build your own plugin. Coming Soon!
            </p>
          </div> */}
        </div>
      </ScrollShadow>
      {/* {!isAuthenticated && (
        <div className={styles.modalOverlay}>
          <div className={styles.button} onClick={handleAuth}>
            Sign In
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Plugins;
