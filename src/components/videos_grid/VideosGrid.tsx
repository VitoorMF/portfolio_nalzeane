import { useState, useRef, useEffect } from "react";
import "./VideosGrid.css";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";
import AddVideoDialog from "../dialogs/addVideoDialog";

type Props = { isAdmin?: boolean };

function VideosGrid({ isAdmin = false }: Props) {
  const [videoList, setVideoList] = useState<string[]>([]);
  const [addVideoDialogOpen, setAddVideoDialogOpen] = useState(false);

  // diálogo de delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const storage = getStorage();
  const videosFolder = ref(storage, "videos/");

  const fetchVideos = () =>
    listAll(videosFolder)
      .then((res) => Promise.all(res.items.map((i) => getDownloadURL(i))))
      .then((urls) => setVideoList(urls.reverse())) // mostra os mais recentes primeiro
      .catch((err) => console.error("Erro listando vídeos:", err));

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

  const openDeleteDialog = (src: string) => {
    if (!isAdmin) return;
    setSelectedVideo(src);
    setError(null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVideo) return;
    try {
      setDeleting(true);
      setError(null);
      // pode passar a URL https direto para ref(storage, url)
      const objRef = ref(storage, selectedVideo);
      await deleteObject(objRef);
      // remove localmente para parecer instantâneo
      setVideoList((prev) => prev.filter((u) => u !== selectedVideo));
      setDeleteOpen(false);
      setSelectedVideo(null);
    } catch (e: unknown) {
      console.error(e);
      setError("Falha ao deletar. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="videos">
      <h3 className="section_title">Videos</h3>
      <div className="videos_grid">
        {videoList.map((src, idx) => (
          <div className="video_tile" key={src}>
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              className="videoo_player"
              src={src}
              muted
              loop
              playsInline
              preload="metadata"
              onClick={() => openDeleteDialog(src)}
            />
            {isAdmin && (
              <button
                className="video_action"
                type="button"
                onClick={() => openDeleteDialog(src)}
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
              src={selectedVideo}
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
