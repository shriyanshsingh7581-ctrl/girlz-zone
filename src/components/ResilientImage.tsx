import React, { useState, useEffect } from 'react';
import { StrictProductCategory } from '../types';
import { getFallbackSvgForCategory } from '../utils/artwork';

interface ResilientImageProps {
  src: string;
  alt: string;
  category?: StrictProductCategory;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  category = 'Makeup',
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    src || getFallbackSvgForCategory(category, alt)
  );

  useEffect(() => {
    setImgSrc(src || getFallbackSvgForCategory(category, alt));
  }, [src, category, alt]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        const fallback = getFallbackSvgForCategory(category, alt);
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      className={className}
    />
  );
};
