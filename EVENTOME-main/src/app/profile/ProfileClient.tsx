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
import { Skeleton } from '@/components/ui/skeleton';
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
      
      const remoteProfile = await getUserProfile(user.id);
      
      if (remoteProfile) {
        setProfileData(remoteProfile as UserProfile);
      } else {
        // If no profile exists, create one from the auth user
        const initialProfile: UserProfile = {
          displayName: user.user_metadata?.name || '',
          email: user.email || '',
          photoURL: user.user_metadata?.avatar_url || '',
        };
        await updateUserProfile(user.id, initialProfile);
        setProfileData(initialProfile);
      }
      setIsProfileLoading(false);
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

  const ProfileSkeleton = () => (
    <div className="w-full max-w-lg mx-auto p-8 space-y-6">
        <div className="flex items-center space-x-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-full" />
            </div>
        </div>
        <div className="space-y-4 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);


  if (isUserLoading || isProfileLoading || !profileData) {
    return (
       <div className="container py-12 md:py-24 flex items-center justify-center">
         <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen container py-12 md:py-24 flex items-center justify-center">
      <div
        ref={tiltRef}
        className="w-full max-w-lg bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl shadow-black/20 transition-all duration-300"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="p-8 space-y-8" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-white/10">
                <AvatarImage src={profileData.photoURL} alt={profileData.displayName} />
                <AvatarFallback>{(profileData.displayName || profileData.email)?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
            </div>
            <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-2">
                    <Input
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="text-2xl font-bold bg-transparent border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-center"
                        placeholder="Your Name"
                    />
                </div>
              <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase/>Role / Student Status</Label>
              <Input 
                name="profession"
                value={profileData.profession || ''}
                onChange={handleInputChange}
                placeholder="e.g., Student"
                className="bg-background/70 border-white/10"
                />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground"><GraduationCap/>College / University</Label>
              <Input 
                name="college"
                value={profileData.college || ''}
                onChange={handleInputChange}
                placeholder="e.g., UCER"
                className="bg-background/70 border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground">Gender</Label>
              <RadioGroup
                value={profileData.gender}
                onValueChange={handleGenderChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

             <p className="text-center text-xs text-muted-foreground pt-4">Your changes are saved automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
