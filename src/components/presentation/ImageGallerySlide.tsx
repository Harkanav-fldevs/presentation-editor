"use client";

import React from "react";
import { ImageGalleryData } from "@/mastra/types/slide-templates";

interface ImageGallerySlideProps {
  title?: string;
  galleryData: ImageGalleryData;
}

export function ImageGallerySlide({
  title,
  galleryData,
}: ImageGallerySlideProps) {
  // Add comprehensive null/undefined checks
  if (
    !galleryData ||
    !galleryData.images ||
    !Array.isArray(galleryData.images)
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="text-center text-gray-500">
          <p>No gallery data available</p>
        </div>
      </div>
    );
  }

  const getGalleryLayout = () => {
    const imageCount = galleryData.images.length;

    if (imageCount === 2) {
      return "grid-cols-2";
    } else if (imageCount === 3) {
      return "grid-cols-3";
    } else if (imageCount === 4) {
      return "grid-cols-2 grid-rows-2";
    } else {
      return "grid-cols-3";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <div className="w-full max-w-6xl">
        {galleryData.content && (
          <div
            className="text-lg mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: galleryData.content }}
          />
        )}

        <div className={`grid ${getGalleryLayout()} gap-6`}>
          {galleryData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.src || "/placeholder-image.png"}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
