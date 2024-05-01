"use client";

import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
