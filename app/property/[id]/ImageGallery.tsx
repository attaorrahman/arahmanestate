'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  mainImage: string;
  images: string[];
  title: string;
}

export default function ImageGallery({ mainImage, images, title }: ImageGalleryProps) {
  const allImages = [mainImage, ...images];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[420px] sm:h-[520px]">
      {/* Main image */}
      <div className="lg:col-span-8 rounded-sm overflow-hidden image-zoom h-full">
        <img
          src={allImages[activeIndex]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 h-full overflow-y-auto pr-1 custom-scrollbar">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-sm overflow-hidden shrink-0 transition-all duration-200 ${
                i === activeIndex
                  ? 'ring-2 ring-[#C9A84C] opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ height: allImages.length <= 3 ? `calc(${100 / Math.min(allImages.length - 0, 3)}% - 8px)` : '140px' }}
            >
              <img
                src={img}
                alt={`${title} - view ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#C9A84C] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                  Main
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile thumbnails */}
      {allImages.length > 1 && (
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-16 rounded-sm overflow-hidden shrink-0 transition-all duration-200 ${
                i === activeIndex
                  ? 'ring-2 ring-[#C9A84C] opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} - view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
