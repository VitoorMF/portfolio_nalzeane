import { useState, useRef, useEffect } from "react";
import "./VideosGrid.css";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import AddVideoDialog from "../dialogs/addVideoDialog";

type Props = { isAdmin?: boolean };
type VideoItem = {
  src: string;
  filename: string;
  thumb: string | null;
};

async function createThumbnailFromUrl(url: string): Promise<Blob | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const videoBlob = await resp.blob();
    const objectUrl = URL.createObjectURL(videoBlob);
    const video = document.createElement("video");
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("metadata-error"));
    });

    const seekTime = Number.isFinite(video.duration) && video.duration > 1 ? 1 : 0;
    video.currentTime = seekTime;

    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("seek-error"));
    });

    const maxWidth = 540;
    const ratio = video.videoWidth / video.videoHeight || 9 / 16;
    const width = Math.min(video.videoWidth || maxWidth, maxWidth);
    const height = Math.max(1, Math.round(width / ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);

    const thumbBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.82);
    });

    URL.revokeObjectURL(objectUrl);
    video.src = "";
    return thumbBlob;
  } catch {
    return null;
  }
}

function VideosGrid({ isAdmin = false }: Props) {
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
  const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});
  const [addVideoDialogOpen, setAddVideoDialogOpen] = useState(false);

  // diálogo de delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillStatus, setBackfillStatus] = useState<string>("");

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const storage = getStorage();
  const videosFolder = ref(storage, "videos/");

  const fetchVideos = () => {
    setLoadingVideos(true);
    setLoadError(null);
    return listAll(videosFolder)
      .then((res) =>
        Promise.all(
          res.items.map(async (item) => {
            const src = await getDownloadURL(item);
            let thumb: string | null = null;
            try {
              thumb = await getDownloadURL(ref(storage, `videos_thumbs/${item.name}.jpg`));
            } catch {
              thumb = null;
            }
            return {
              src,
              filename: item.name,
              thumb,
            } as VideoItem;
          })
        )
      )
      .then((items) => {
        setVideoList(items.reverse());
        setFailedVideos({});
        setReadyVideos({});
        setFailedThumbs({});
      })
      .catch((err) => {
        console.error("Erro listando vídeos:", err);
        setLoadError("Não foi possível carregar os vídeos.");
      })
      .finally(() => setLoadingVideos(false));
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoList.length);
  }, [videoList]);

  const handleAddClick = () => setAddVideoDialogOpen(true);

  const handleCreate = () => {
    fetchVideos();
    setAddVideoDialogOpen(false);
  };

  const openDeleteDialog = (video: VideoItem) => {
    if (!isAdmin) return;
    setSelectedVideo(video);
    setError(null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVideo) return;
    try {
      setDeleting(true);
      setError(null);
      // pode passar a URL https direto para ref(storage, url)
      const objRef = ref(storage, selectedVideo.src);
      await deleteObject(objRef);
      try {
        await deleteObject(ref(storage, `videos_thumbs/${selectedVideo.filename}.jpg`));
      } catch {
        // thumb pode nao existir em uploads antigos
      }
      // remove localmente para parecer instantâneo
      setVideoList((prev) => prev.filter((video) => video.src !== selectedVideo.src));
      setDeleteOpen(false);
      setSelectedVideo(null);
    } catch (e: unknown) {
      console.error(e);
      setError("Falha ao deletar. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBackfillThumbnails = async () => {
    const missing = videoList.filter((video) => !video.thumb);
    if (!missing.length) {
      setBackfillStatus("Todos os videos ja possuem thumbnail.");
      return;
    }

    setIsBackfilling(true);
    setBackfillStatus(`Gerando 0/${missing.length}...`);

    let success = 0;
    for (let i = 0; i < missing.length; i += 1) {
      const video = missing[i];
      setBackfillStatus(`Gerando ${i + 1}/${missing.length}...`);
      const blob = await createThumbnailFromUrl(video.src);
      if (!blob) continue;
      try {
        await uploadBytes(ref(storage, `videos_thumbs/${video.filename}.jpg`), blob, {
          contentType: "image/jpeg",
        });
        success += 1;
      } catch (thumbErr) {
        console.error("Erro ao salvar thumbnail:", thumbErr);
      }
    }

    setBackfillStatus(`Concluido: ${success}/${missing.length} thumbnails geradas.`);
    setIsBackfilling(false);
    fetchVideos();
  };

  return (
    <section className={`videos ${isAdmin ? "videos--admin" : ""}`}>
      <h3 className="section_title">Videos</h3>
      {isAdmin && (
        <div className="video_admin_actions">
          <button
            type="button"
            className="video_backfill_btn"
            onClick={handleBackfillThumbnails}
            disabled={isBackfilling || loadingVideos}
          >
            {isBackfilling ? "Gerando..." : "Gerar thumbnails ausentes"}
          </button>
          {backfillStatus && <p className="video_backfill_status">{backfillStatus}</p>}
        </div>
      )}
      {loadingVideos && <p>Carregando videos...</p>}
      {loadError && <p>{loadError}</p>}
      <div className="videos_grid">
        {videoList.map((video, idx) => (
          <div className="video_tile" key={video.src}>
            {video.thumb && !failedThumbs[video.src] ? (
              <img
                className="video_thumb"
                src={video.thumb}
                alt="Thumbnail do video"
                loading="lazy"
                onError={() => {
                  setFailedThumbs((prev) => ({ ...prev, [video.src]: true }));
                }}
              />
            ) : (
              <>
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  className="video_player"
                  src={`${video.src}#t=1`}
                  autoPlay={isAdmin}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onClick={() => openDeleteDialog(video)}
                  onLoadedMetadata={(e) => {
                    setReadyVideos((prev) => ({ ...prev, [video.src]: true }));
                    const player = e.currentTarget;
                    if (isAdmin) {
                      player.play().catch(() => {
                        // ignora bloqueio de autoplay
                      });
                    }
                  }}
                  onLoadedData={() => {
                    setReadyVideos((prev) => ({ ...prev, [video.src]: true }));
                  }}
                  onError={() => {
                    setReadyVideos((prev) => ({ ...prev, [video.src]: true }));
                    setFailedVideos((prev) => ({ ...prev, [video.src]: true }));
                  }}
                />
                {!readyVideos[video.src] && !failedVideos[video.src] && (
                  <div className="video_placeholder">Carregando preview...</div>
                )}
                {failedVideos[video.src] && (
                  <div className="video_fallback">Preview indisponível</div>
                )}
              </>
            )}
            {isAdmin && (
              <button
                className="video_action"
                type="button"
                onClick={() => openDeleteDialog(video)}
                aria-label="Deletar vídeo"
                title="Deletar vídeo"
              >
                &#128465; {/* ícone simples de lixeira */}
              </button>
            )}
          </div>
        ))}

        {isAdmin && (
          <button className="add_tile" onClick={handleAddClick} type="button">
            <span className="add_plus">＋</span>
            <span>Adicionar</span>
          </button>
        )}
      </div>

      {/* Dialog para upload */}
      <AddVideoDialog
        open={addVideoDialogOpen}
        onClose={() => setAddVideoDialogOpen(false)}
        onCreate={handleCreate}
      />

      {/* Dialog de confirmação de delete (sem MUI, HTML <dialog>) */}
      <dialog open={deleteOpen} className="dialog">
        <div className="dialog_body">
          <h3>Deletar vídeo?</h3>
          {selectedVideo && (
            <video
              className="dialog_preview"
              src={selectedVideo.src}
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          {error && <p className="dialog_error">{error}</p>}
          <div className="dialog_actions">
            <button
              className="btn btn_secondary"
              onClick={() => {
                setDeleteOpen(false);
                setSelectedVideo(null);
              }}
              disabled={deleting}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="btn btn_danger"
              onClick={handleConfirmDelete}
              disabled={deleting}
              type="button"
            >
              {deleting ? "Deletando..." : "Deletar"}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

export default VideosGrid;
