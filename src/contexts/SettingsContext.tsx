"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  triggerHaptic: () => void;
  playNotificationSound: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("evento-theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const savedHaptics = localStorage.getItem("evento-haptics");
    if (savedHaptics !== null) setHapticsEnabled(savedHaptics === "true");

    const savedSound = localStorage.getItem("evento-sound");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");

    const savedPush = localStorage.getItem("evento-push");
    if (savedPush !== null) setPushNotificationsEnabled(savedPush === "true");
    
    // Check actual notification permission on mount and sync state
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted") {
        setPushNotificationsEnabled(false);
      }
    }
  }, []);

  // Sync theme to HTML class & localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("evento-theme", theme);
  }, [theme]);

  // Sync haptics & sound to localStorage
  useEffect(() => {
    localStorage.setItem("evento-haptics", String(hapticsEnabled));
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem("evento-sound", String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("evento-push", String(pushNotificationsEnabled));
  }, [pushNotificationsEnabled]);

  const triggerHaptic = () => {
    if (hapticsEnabled && typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // 50ms vibration
    }
  };

  const playNotificationSound = () => {
    if (soundEnabled && typeof window !== "undefined") {
      // Create a simple beep sound using the Web Audio API to avoid external asset dependencies
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        console.error("Audio API not supported");
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        hapticsEnabled,
        setHapticsEnabled,
        soundEnabled,
        setSoundEnabled,
        pushNotificationsEnabled,
        setPushNotificationsEnabled,
        triggerHaptic,
        playNotificationSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
