'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VanillaTilt from 'vanilla-tilt';
import { useUser } from '@/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mail, GraduationCap, Briefcase } from 'lucide-react';
import LoaderBox from '@/components/loader-box';
import { getUserProfile, updateUserProfile } from '@/actions/users';

type UserProfile = {
  displayName: string;
  email: string;
  photoURL: string;
  college?: string;
  profession?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
};

export default function ProfileClient() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tiltRef = useRef<HTMLDivElement>(null);

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Debounce saving to avoid spamming the database on every keystroke
  const saveProfileDebounced = useCallback((data: UserProfile, userId: string) => {
    updateUserProfile(userId, data).catch(err => {
      console.error("Failed to save profile", err);
    });
  }, []);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 5,
        speed: 300,
        glare: true,
        'max-glare': 0.2,
        perspective: 1000,
        scale: 1.02,
      });
    }
    return () => {
      if (tiltRef.current && (tiltRef.current as any).vanillaTilt) {
        (tiltRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [profileData]);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
        const redirect = searchParams.get('redirect');
        router.push(redirect ? `/login?redirect=${redirect}` : '/login?redirect=/profile');
    }
  }, [user, isUserLoading, router, searchParams]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const remoteProfile = await getUserProfile(user.id);
        
        if (remoteProfile) {
          setProfileData(remoteProfile as UserProfile);
        } else {
          // If no profile exists, create one from the auth user
          const initialProfile: UserProfile = {
            displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            photoURL: user.user_metadata?.avatar_url || '',
          };
          await updateUserProfile(user.id, initialProfile);
          setProfileData(initialProfile);
        }
      } catch (error) {
        console.error("Failed to load or create profile:", error);
        // Fallback to simple profile data so UI doesn't get stuck
        setProfileData({
          displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          photoURL: user.user_metadata?.avatar_url || '',
        });
      } finally {
        setIsProfileLoading(false);
      }
    }
    
    if (user && !isUserLoading) {
      loadProfile();
    }
  }, [user, isUserLoading]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profileData && user) {
      const { name, value } = e.target;
      const updatedProfile = { ...profileData, [name]: value };
      setProfileData(updatedProfile);
      saveProfileDebounced(updatedProfile, user.id);
    }
  };

  const handleGenderChange = (value: UserProfile['gender']) => {
     if (profileData && user) {
      const updatedProfile = { ...profileData, gender: value };
      setProfileData(updatedProfile);
      saveProfileDebounced(updatedProfile, user.id);
    }
  };

  if (isUserLoading || isProfileLoading || !profileData) {
    return (
       <div className="container py-12 md:py-24 flex items-center justify-center bg-brutalBg min-h-screen">
         <LoaderBox />
      </div>
    );
  }

  return (
    <div className="min-h-screen container py-12 md:py-24 flex items-center justify-center bg-brutalBg relative overflow-hidden">
        {/* Wireframe Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
      <div
        ref={tiltRef}
        className="w-full max-w-lg bg-white border-8 border-black rounded-none shadow-[12px_12px_0px_0px_var(--brutal-shadow)] transition-all duration-300 relative z-10"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Decorative Top Bar */}
        <div className="h-6 w-full bg-brutalPurple border-b-8 border-black"></div>
        <div className="p-8 space-y-8" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_var(--brutal-shadow)] bg-brutalYellow">
                <AvatarImage src={profileData.photoURL} alt={profileData.displayName} className="rounded-none object-cover" />
                <AvatarFallback className="text-4xl font-black rounded-none bg-transparent text-black">{profileData.displayName?.charAt(0).toUpperCase() || profileData.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-brutalGreen border-4 border-black shadow-[2px_2px_0px_0px_var(--brutal-shadow)] font-black text-black uppercase text-xs">Active</div>
            </div>
            <div className="text-center flex-1 w-full mt-4">
                <div className="flex items-center justify-center gap-2 border-b-4 border-black pb-2 mb-2">
                    <Input
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="text-3xl font-black uppercase tracking-tight bg-transparent border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-center text-black hover:bg-brutalYellow/50 focus:bg-brutalYellow transition-all"
                        placeholder="Your Name"
                    />
                </div>
              <p className="text-black font-bold flex items-center justify-center gap-2 text-lg bg-white border-2 border-black py-1 px-3 w-fit mx-auto shadow-[2px_2px_0px_0px_var(--brutal-shadow)]">
                <Mail className="h-5 w-5" strokeWidth={3} />
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-black uppercase text-black"><Briefcase strokeWidth={3}/>Role / Student Status</Label>
              <Input 
                name="profession"
                value={profileData.profession || ''}
                onChange={handleInputChange}
                placeholder="e.g., Student"
                className="bg-white border-4 border-black h-12 rounded-none font-bold text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_var(--brutal-shadow)] transition-all"
                />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-black uppercase text-black"><GraduationCap strokeWidth={3}/>College / University</Label>
              <Input 
                name="college"
                value={profileData.college || ''}
                onChange={handleInputChange}
                placeholder="e.g., UCER"
                className="bg-white border-4 border-black h-12 rounded-none font-bold text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_var(--brutal-shadow)] transition-all"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-black font-black uppercase">Gender</Label>
              <RadioGroup
                value={profileData.gender}
                onValueChange={handleGenderChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2 border-2 border-black p-2 bg-brutalBlue shadow-[2px_2px_0px_0px_var(--brutal-shadow)]">
                  <RadioGroupItem value="Male" id="male" className="border-2 border-black text-black" />
                  <Label htmlFor="male" className="font-bold text-black cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2 border-2 border-black p-2 bg-brutalRed shadow-[2px_2px_0px_0px_var(--brutal-shadow)]">
                  <RadioGroupItem value="Female" id="female" className="border-2 border-black text-black" />
                  <Label htmlFor="female" className="font-bold text-black cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>

             <div className="mt-8 pt-4 border-t-4 border-black text-center">
                 <p className="text-sm font-black uppercase text-black bg-brutalYellow border-2 border-black py-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] inline-block px-6">Your changes are saved automatically.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
