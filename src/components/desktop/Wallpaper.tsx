import React, { useEffect, useState } from 'react';
import { useOSStore } from '../../store/useOSStore';

export const Wallpaper: React.FC = () => {
  const isMobile = useOSStore(state => state.isMobile);
  const tweaks = useOSStore(state => state.tweaks);
  const wallpaperType = isMobile ? 'image' : (tweaks.wallpaperType || 'image');
  const wallpaperUrl = tweaks.wallpaperUrl || '/wallpapers/sonoma-light.jpg';
  
  const [timeShiftUrl, setTimeShiftUrl] = useState('/wallpapers/sonoma-light.jpg');

  useEffect(() => {
    if (wallpaperType === 'time-shifting') {
      const checkTime = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
          setTimeShiftUrl('/wallpapers/sonoma-light.jpg');
        } else {
          setTimeShiftUrl('/wallpapers/sonoma-dark.jpg');
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
        src="/mobile-background.jpg" 
        alt="Mobile Wallpaper" 
        className="block md:hidden w-full h-full object-cover absolute inset-0 z-[-1] select-none pointer-events-none"
      />

      {/* Desktop backgrounds */}
      <div className="hidden md:block w-full h-full absolute inset-0">
        {wallpaperType === 'image' && (
          <img 
            src={wallpaperUrl} 
            alt="Wallpaper" 
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
            className="w-full h-full object-cover absolute inset-0 pointer-events-none z-[-1] scale-[1.2]"
          />
        )}
        {wallpaperType === 'time-shifting' && (
          <img 
            src={timeShiftUrl} 
            alt="Time Shifting Wallpaper" 
            className="w-full h-full object-cover absolute inset-0 z-[-1] select-none pointer-events-none transition-opacity duration-1000"
          />
        )}
      </div>
    </div>
  );
};
