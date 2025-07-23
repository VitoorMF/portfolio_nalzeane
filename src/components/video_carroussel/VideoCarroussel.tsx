import { useState, useRef, useEffect } from "react";
import "./VideoCarroussel.css";
import nanaVideo from "../../assets/videos/nana_video.mp4";
import nanaVideo2 from "../../assets/videos/nana_video2.mp4";

const videoList = [nanaVideo, nanaVideo2];

function VideoCarrousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize videoRefs array based on videoList length
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoList.length);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play();
        } else {
          // Pause and reset other videos
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const handlePrev = () => {
    const next = currentIndex === 0 ? videoList.length - 1 : currentIndex - 1;
    setCurrentIndex(next);
  };

  const handleNext = () => {
    const next = currentIndex === videoList.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(next);
  };

  return (
    <section className="video_carrousel">
      <button className="arrow left" onClick={handlePrev}>
        ‹
      </button>

      <div className="video_wrapper">
        {videoList.map((videoSrc, index) => (
          <video
            key={videoSrc} 
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            className={`video_player ${
              index === currentIndex ? "visible" : ""
            }`}
            src={videoSrc}
            controls
            autoPlay={index === currentIndex} 
            muted
            loop
            playsInline 
          />
        ))}
      </div>

      <button className="arrow right" onClick={handleNext}>
        ›
      </button>
    </section>
  );
}

export default VideoCarrousel;
