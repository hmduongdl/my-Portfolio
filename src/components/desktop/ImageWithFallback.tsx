import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackGradient?: string; // CSS gradient string
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText,
  fallbackGradient = 'linear-gradient(135deg, #c8c6c1 0%, #a8a5a0 100%)', // macOS warm gray gradient
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`${className} flex items-center justify-center select-none uppercase font-bold text-center text-white`}
        style={{ background: fallbackGradient }}
      >
        {fallbackText ? fallbackText.charAt(0) : '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};
