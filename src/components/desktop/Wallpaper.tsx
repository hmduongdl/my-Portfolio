import React, { useEffect, useState } from 'react';
import { useOSStore } from '../../store/useOSStore';

const lightWallpaperUrl = '/images/wallpapers/mobile-background.webp';
const darkWallpaperUrl = '/images/profile/profile-background.webp';
const mobileWallpaperUrl = '/images/wallpapers/mobile-background.webp';

export const Wallpaper: React.FC = () => {
  const isMobile = useOSStore(state => state.isMobile);
  const tweaks = useOSStore(state => state.tweaks);
  const wallpaperType = isMobile ? 'image' : (tweaks.wallpaperType || 'image');
  const wallpaperUrl = tweaks.wallpaperUrl || lightWallpaperUrl;
  
  const [timeShiftUrl, setTimeShiftUrl] = useState(lightWallpaperUrl);

  useEffect(() => {
    if (wallpaperType === 'time-shifting') {
      const checkTime = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
          setTimeShiftUrl(lightWallpaperUrl);
        } else {
          setTimeShiftUrl(darkWallpaperUrl);
        }
      };
      
      checkTime();
      
      // Kiểm tra lại mỗi phút
      const interval = setInterval(checkTime, 60000);
      return () => clearInterval(interval);
    }
  }, [wallpaperType]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none bg-black">
      {/* Mobile specific background */}
      <img 
        src={mobileWallpaperUrl} 
        alt="Sonoma mobile wallpaper background" 
        className="block md:hidden w-full h-full object-cover absolute inset-0 select-none pointer-events-none"
      />

      {/* Desktop backgrounds */}
      <div className="hidden md:block w-full h-full absolute inset-0">
        {wallpaperType === 'image' && (
          <img 
            src={wallpaperUrl} 
            alt="Desktop wallpaper background" 
            className="w-full h-full object-cover absolute inset-0 z-[-1] select-none pointer-events-none"
          />
        )}
        {wallpaperType === 'video' && (
          <video 
            src={wallpaperUrl} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover absolute inset-0 pointer-events-none z-[-1]"
          />
        )}
        {wallpaperType === 'time-shifting' && (
          <img 
            src={timeShiftUrl} 
            alt="Time shifting desktop wallpaper background" 
            className="w-full h-full object-cover absolute inset-0 z-[-1] select-none pointer-events-none transition-opacity duration-1000"
          />
        )}
      </div>
    </div>
  );
};
