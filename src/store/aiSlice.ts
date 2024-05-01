import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AIState {
  model: string;
  temperature: number;
  maxLength: number;
  topP: number;
  frequency: number;
  presence: number;
  customPrompt: string;
}

const initialState: AIState = {
  model: "gpt-3.5-turbo",
  temperature: 1,
  maxLength: 512,
  topP: 1,
  frequency: 0,
  presence: 0,
  customPrompt: "",
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload;
    },
    setMaxLength: (state, action: PayloadAction<number>) => {
      state.maxLength = action.payload;
    },
    setTopP: (state, action: PayloadAction<number>) => {
      state.topP = action.payload;
    },
    setFrequency: (state, action: PayloadAction<number>) => {
      state.frequency = action.payload;
    },
    setPresence: (state, action: PayloadAction<number>) => {
      state.presence = action.payload;
    },
    setCustomPrompt: (state, action: PayloadAction<string>) => {
      state.customPrompt = action.payload;
    },
    resetAISettings: () => {
      return initialState;
    },
  },
});

export const {
  setModel,
  setTemperature,
  setMaxLength,
  setTopP,
  setFrequency,
  setPresence,
  setCustomPrompt,
  resetAISettings,
} = aiSlice.actions;

export const selectAI = (state: RootState) => state.ai;
export const selectModel = (state: RootState) => state.ai.model;
export const selectTemperature = (state: RootState) => state.ai.temperature;
export const selectMaxLength = (state: RootState) => state.ai.maxLength;
export const selectTopP = (state: RootState) => state.ai.topP;
export const selectFrequency = (state: RootState) => state.ai.frequency;
export const selectPresence = (state: RootState) => state.ai.presence;
export const selectCustomPrompt = (state: RootState) => state.ai.customPrompt;

export default aiSlice.reducer;
