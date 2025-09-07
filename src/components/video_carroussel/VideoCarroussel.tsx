import { useState, useRef, useEffect } from "react";
import "./VideoCarroussel.css";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

function VideoCarrousel({ isAdmin = false }) {
  const [videoList, setVideoList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const storage = getStorage();
  const videosFolder = ref(storage, "videos/");

  // 1) função que busca todos os vídeos do storage
  const fetchVideos = () =>
    listAll(videosFolder)
      .then((res) => Promise.all(res.items.map((i) => getDownloadURL(i))))
      .then((urls) => setVideoList(urls.reverse())) // mostra os mais recentes primeiro
      .catch((err) => console.error("Erro listando vídeos:", err));

  // carregamento inicial
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sincroniza refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoList.length);
  }, [videoList]);

  // play/pause automático
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) vid.play();
      else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentIndex]);

  const handlePrev = () =>
    setCurrentIndex((i) => (i === 0 ? videoList.length - 1 : i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => (i === videoList.length - 1 ? 0 : i + 1));

  return (
    <section className="video_carrousel">
      <div className="video_arrows">
        <button className="arrow left" onClick={handlePrev}>
          ‹
        </button>
        <div className="video_wrapper">
          {videoList.map((src, idx) => (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              className={`video_player ${
                idx === currentIndex ? "visible" : ""
              }`}
              src={src}
              controls
              muted
              loop
              autoPlay
              playsInline
              onClick={() => {
                if (isAdmin) {
                  console.log("Clicou no vídeo", src);
                }
              }}
            />
          ))}
        </div>
        <button className="arrow right" onClick={handleNext}>
          ›
        </button>
      </div>
    </section>
  );
}

export default VideoCarrousel;
