import React, { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import Image from "next/image";
import Auth from "../Auth/Auth";
import { useDisclosure } from "@nextui-org/modal";
import { useDispatch, useSelector } from "react-redux";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Tooltip } from "@nextui-org/tooltip";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import {
  setModel,
  setTemperature,
  setMaxLength,
  setTopP,
  setFrequency,
  setPresence,
  setCustomPrompt,
  selectModel,
  selectTemperature,
  selectMaxLength,
  selectTopP,
  selectFrequency,
  selectPresence,
  selectCustomPrompt,
  resetAISettings,
} from "@/store/aiSlice";
import { selectAuthState } from "@/store/authSlice";
import { MODELS } from "@/utils/data";

import Info from "../../../public/svgs/Info.svg";
import Selector from "../../../public/svgs/Selector.svg";

const Settings = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector(selectAuthState);

  const aiModel = useSelector(selectModel);
  const aiTemperature = useSelector(selectTemperature);
  const aiMaxLength = useSelector(selectMaxLength);
  const aiTopP = useSelector(selectTopP);
  const aiFrequency = useSelector(selectFrequency);
  const aiPresence = useSelector(selectPresence);
  const aiCustomPrompt = useSelector(selectCustomPrompt);

  const [model, setModelLocal] = useState(aiModel);
  const [temperature, setTemperatureLocal] = useState(aiTemperature);
  const [maxLength, setMaxLengthLocal] = useState(aiMaxLength);
  const [topP, setTopPLocal] = useState(aiTopP);
  const [frequency, setFrequencyLocal] = useState(aiFrequency);
  const [presence, setPresenceLocal] = useState(aiPresence);
  const [customPrompt, setCustomPromptLocal] = useState(aiCustomPrompt);
  const [hasChanges, setHasChanges] = useState(false);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const isChanged =
      aiModel !== model ||
      aiTemperature !== temperature ||
      aiMaxLength !== maxLength ||
      aiTopP !== topP ||
      aiFrequency !== frequency ||
      aiPresence !== presence ||
      aiCustomPrompt !== customPrompt.trim();

    setHasChanges(isChanged);
  }, [model, temperature, maxLength, topP, frequency, presence, customPrompt]);

  useEffect(() => {
    setModelLocal(aiModel);
    setTemperatureLocal(aiTemperature);
    setMaxLengthLocal(aiMaxLength);
    setTopPLocal(aiTopP);
    setFrequencyLocal(aiFrequency);
    setPresenceLocal(aiPresence);
    setCustomPromptLocal(aiCustomPrompt);
  }, [
    aiModel,
    aiTemperature,
    aiMaxLength,
    aiTopP,
    aiFrequency,
    aiPresence,
    aiCustomPrompt,
  ]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelLocal(e.target.value);
    if (e.target.value !== aiModel) {
      setHasChanges(true);
    }
  };
  const handleSaveSetting = () => {
    dispatch(setModel(model));
    dispatch(setTemperature(temperature));
    dispatch(setMaxLength(maxLength));
    dispatch(setTopP(topP));
    dispatch(setFrequency(frequency));
    dispatch(setPresence(presence));
    dispatch(setCustomPrompt(customPrompt));
    setHasChanges(false);
    console.log("Settings saved");
  };
  const handleResetSetting = () => {
    dispatch(resetAISettings());
  };

  const handleModal = () => {
    onOpen();
  };

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Settings</div>
        <div
          className={styles.titleButtonRow}
          style={{ opacity: hasChanges ? 1 : 0 }}
        >
          <div className={styles.titleButton} onClick={handleSaveSetting}>
            <p className={styles.titleButtonText}>Save</p>
          </div>
          <div className={styles.titleButton} onClick={handleResetSetting}>
            <p className={styles.titleButtonText}>Reset</p>
          </div>
        </div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Model</div>
            <Tooltip
              content="For Images, we only use GPT-4o"
              color={"warning"}
              placement={"bottom-end"}
              className={styles.tooltip}
            >
              <Image
                src={Info}
                alt={"info"}
                width={16}
                height={16}
                className={styles.tooltipIcon}
              />
            </Tooltip>
          </div>
          <Select
            value={model}
            onChange={handleSelectChange}
            placeholder={model}
            labelPlacement="outside"
            className={styles.selector}
            disableSelectorIconRotation
            selectorIcon={<Image src={Selector} alt="Selector" />}
            scrollShadowProps={{
              isEnabled: false,
            }}
            classNames={{
              trigger:
                "rounded-lg bg-[#ffffff14] data-[hover=true]:bg-[#ffffff14]",
              listboxWrapper: "rounded-lg bg-[#ffffff14]",
            }}
            popoverProps={{
              classNames: {
                base: "rounded-lg bg-[#ffffff14]",
                content: "p-0 rounded-lg border-none",
              },
            }}
          >
            {MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </Select>
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Temperature</div>
            <div className={styles.listHeader}>{temperature}</div>
          </div>
          <Slider
            size="sm"
            value={temperature}
            onChange={(value) => setTemperatureLocal(Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={temperature}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Maximum length</div>
            <div className={styles.listHeader}>{maxLength}</div>
          </div>
          <Slider
            size="sm"
            value={maxLength}
            onChange={(value) => setMaxLengthLocal(Number(value))}
            step={1}
            maxValue={4096}
            minValue={0}
            defaultValue={maxLength}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Top P</div>
            <div className={styles.listHeader}>{topP}</div>
          </div>
          <Slider
            size="sm"
            value={topP}
            onChange={(value) => setTopPLocal(Number(value))}
            step={0.01}
            maxValue={1}
            minValue={0}
            defaultValue={topP}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Frequency penalty</div>
            <div className={styles.listHeader}>{frequency}</div>
          </div>
          <Slider
            size="sm"
            value={frequency}
            onChange={(value) => setFrequencyLocal(Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={frequency}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listRow}>
            <div className={styles.listHeader}>Presence penalty</div>
            <div className={styles.listHeader}>{presence}</div>
          </div>
          <Slider
            size="sm"
            value={presence}
            onChange={(value) => setPresenceLocal(Number(value))}
            step={0.01}
            maxValue={2}
            minValue={0}
            defaultValue={presence}
            color="foreground"
            className={styles.slider}
            renderThumb={(props) => <div {...props} className={styles.thumb} />}
          />
          <div className={styles.listHeader}>Custom Prompt</div>
          <div className={styles.textareaContainer}>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPromptLocal(e.target.value)}
              className={styles.textarea}
              placeholder="Write your prompt here..."
            />
          </div>
        </div>
      </ScrollShadow>
      {!isAuthenticated && (
        <div className={styles.modalOverlay}>
          {!isAuthenticated && (
            <div className={styles.modalButton} onClick={() => handleModal()}>
              Sign In
            </div>
          )}
        </div>
      )}
      <Auth isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Settings;
