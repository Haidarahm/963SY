import { useEffect, useRef, useState } from "react";
import "./LazyImage.css";
import { Skeleton } from "antd";
const LazyImage = ({ src, alt, className, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            // Load the image
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setIsLoaded(true);
              observer.unobserve(entry.target);
            };
          }
        });
      },
      {
        rootMargin: "200px", // Load images 200px before they enter viewport
        threshold: 0.01,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src, isLoaded]);

  return (
    <div
      ref={imageRef}
      className={`lazy-image-container ${className}`}
      style={{ width, height }}
    >
      {isLoaded ? (
        <img src={src} alt={alt} className="lazy-loaded" />
      ) : (
        // <div className="lazy-placeholder" style={{ width, height }} />
        <Skeleton.Node active />
      )}
    </div>
  );
};

export default LazyImage;
