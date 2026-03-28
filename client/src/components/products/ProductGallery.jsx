import { useState } from 'react';

export function ProductGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(images[0]?.url || '');

  return (
    <div className="card grid gap-4 p-4 md:grid-cols-[88px_minmax(0,1fr)]">
      <div className="order-2 flex gap-3 overflow-auto md:order-1 md:flex-col">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedImage(image.url)}
            className={`flex-shrink-0 rounded-sm border p-1 ${
              selectedImage === image.url ? 'border-[var(--fk-blue)]' : 'border-black/10'
            }`}
          >
            <img src={image.url} alt={image.alt || title} className="h-[72px] w-[72px] object-cover md:h-20 md:w-20" />
          </button>
        ))}
      </div>
      <div className="order-1 flex items-center justify-center p-2 md:order-2">
        <img src={selectedImage} alt={title} className="max-h-[460px] w-full object-contain" />
      </div>
    </div>
  );
}
