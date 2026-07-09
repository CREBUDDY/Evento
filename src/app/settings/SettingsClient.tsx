"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrutalSwitch } from "@/components/ui/brutal-switch";
import { Moon, Sun, Vibrate, Volume2, Database, BellRing } from "lucide-react";
import OrganizerCleanupControls from "../dashboard/organizer/OrganizerCleanupControls";
import AttendeeCleanupControls from "../dashboard/attendee/AttendeeCleanupControls";

export default function SettingsClient() {
  const { theme, setTheme, hapticsEnabled, setHapticsEnabled, soundEnabled, setSoundEnabled, pushNotificationsEnabled, setPushNotificationsEnabled, triggerHaptic, playNotificationSound } = useSettings();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    triggerHaptic();
    playNotificationSound();
  };

  const handleHapticsChange = (checked: boolean) => {
    setHapticsEnabled(checked);
    if (checked && typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
    if (checked) {
      // Small timeout to allow state to settle before playing
      setTimeout(() => playNotificationSound(), 50);
    }
    triggerHaptic();
  };

  const handlePushNotificationsChange = async (checked: boolean) => {
    if (checked) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPushNotificationsEnabled(true);
          triggerHaptic();
          playNotificationSound();
        } else {
          setPushNotificationsEnabled(false);
          alert("Please allow notifications in your browser settings to enable this feature.");
        }
      } else {
        alert("Your browser does not support push notifications.");
      }
    } else {
      setPushNotificationsEnabled(false);
      triggerHaptic();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Global Preferences */}
      <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] md:shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
        <CardHeader className="border-b-4 border-black pb-4 bg-brutalYellow">
          <CardTitle className="font-black uppercase text-2xl">Global Preferences</CardTitle>
          <CardDescription className="font-bold text-black">Manage your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y-4 divide-black">
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Dark Mode</h3>
                  <p className="font-bold text-gray-600">Invert colors for a darker experience.</p>
                </div>
              </div>
              <BrutalSwitch 
                checked={theme === 'dark'} 
                onCheckedChange={handleThemeChange} 
              />
            </div>

            {/* Haptics Toggle */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  <Vibrate className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Haptic Feedback</h3>
                  <p className="font-bold text-gray-600">Enable vibrations on supported devices.</p>
                </div>
              </div>
              <BrutalSwitch 
                checked={hapticsEnabled} 
                onCheckedChange={handleHapticsChange} 
              />
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Notification Sounds</h3>
                  <p className="font-bold text-gray-600">Play a sound on important actions.</p>
                </div>
              </div>
              <BrutalSwitch 
                checked={soundEnabled} 
                onCheckedChange={handleSoundChange} 
              />
            </div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  <BellRing className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Push Notifications</h3>
                  <p className="font-bold text-gray-600">Receive native alerts for new events.</p>
                </div>
              </div>
              <BrutalSwitch 
                checked={pushNotificationsEnabled} 
                onCheckedChange={handlePushNotificationsChange} 
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] md:shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
        <CardHeader className="border-b-4 border-black pb-4 bg-brutalPurple text-white">
          <CardTitle className="font-black uppercase text-2xl">Data Management</CardTitle>
          <CardDescription className="font-bold text-white">Clean up your old events and tickets.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y-4 divide-black">
            
            {/* Organizer Cleanup */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Organizer Data</h3>
                  <p className="font-bold text-gray-600">Permanently delete your cancelled/completed events.</p>
                </div>
              </div>
              <div className="md:ml-auto">
                <OrganizerCleanupControls />
              </div>
            </div>

            {/* Attendee Cleanup */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-none border-2 border-black">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase">Attendee Data</h3>
                  <p className="font-bold text-gray-600">Remove cancelled/completed tickets from your history.</p>
                </div>
              </div>
              <div className="md:ml-auto">
                <AttendeeCleanupControls />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}
