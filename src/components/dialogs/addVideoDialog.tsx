// AddVideoDialog.tsx
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Stack,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete as DeleteIcon } from "@mui/icons-material";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import {
  adminDialogSx,
  adminPrimaryButtonSx,
  adminSecondaryButtonSx,
} from "./adminDialogStyles";

export interface NewVideoValues {
  src: string;
  // opcional: descomente se quiser aproveitar extra
  // downloadURL?: string;
  // durationSec?: number;
  // sizeBytes?: number;
  // mime?: string;
}

interface AddVideoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: NewVideoValues) => void;
  maxSizeMB?: number; // default 250
  accept?: string[]; // ex: ["video/mp4","video/webm","video/quicktime"]
}

async function createVideoThumbnail(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = objectUrl;
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Falha ao ler metadados do video."));
    });

    const seekTime = Number.isFinite(video.duration) && video.duration > 1 ? 1 : 0;
    video.currentTime = seekTime;

    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("Falha ao posicionar video para thumbnail."));
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

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.82);
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
    video.src = "";
  }
}

export default function AddVideoDialog({
  open,
  onClose,
  onCreate,
  maxSizeMB = 250,
  accept = ["video/mp4", "video/webm", "video/quicktime"],
}: AddVideoDialogProps) {
  const storage = getStorage();
  const [file, setFile] = React.useState<File | null>(null);
  const [videoURL, setVideoURL] = React.useState<string | null>(null); // preview
  const [duration, setDuration] = React.useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const taskRef = React.useRef<UploadTask | null>(null);

  React.useEffect(() => {
    // limpa objectURL ao trocar/fechar
    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL);
    };
  }, [videoURL]);

  const resetState = () => {
    setFile(null);
    if (videoURL) URL.revokeObjectURL(videoURL);
    setVideoURL(null);
    setDuration(null);
    setUploadProgress(0);
    setError(null);
    setIsUploading(false);
    taskRef.current = null;
  };

  const handleClose = () => {
    if (isUploading && taskRef.current) {
      taskRef.current.cancel();
    }
    resetState();
    onClose();
  };

  const humanSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (f: File): string | null => {
    if (!accept.includes(f.type)) {
      return "Formato inválido. Aceitos: MP4, WEBM, MOV.";
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      return `Arquivo muito grande. Máximo: ${maxSizeMB} MB.`;
    }
    return null;
  };

  const pickFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      if (videoURL) URL.revokeObjectURL(videoURL);
      setVideoURL(null);
      setDuration(null);
      return;
    }
    setError(null);
    setFile(f);
    if (videoURL) URL.revokeObjectURL(videoURL);
    const url = URL.createObjectURL(f);
    setVideoURL(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) pickFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      pickFile(e.dataTransfer.files[0]);
    }
  };

  const extractExt = (name: string) => {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "mp4";
    // preserva extensão para facilitar o uso fora do app
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isUploading) return;

    try {
      setError(null);
      setIsUploading(true);

      const ext = extractExt(file.name);
      const safeName =
        file.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9.-]/g, "")
          .replace(/-+/g, "-") || `video.${ext}`;
      const filename = `${Date.now()}-${safeName}`;
      const videoRef = ref(storage, `videos/${filename}`);
      const thumbBlob = await createVideoThumbnail(file);
      const thumbRef = ref(storage, `videos_thumbs/${filename}.jpg`);

      const task = uploadBytesResumable(videoRef, file, {
        contentType: file.type,
      });
      taskRef.current = task;

      task.on(
        "state_changed",
        (snap) => {
          const prog = (snap.bytesTransferred / snap.totalBytes) * 100;
          setUploadProgress(Math.round(prog));
        },
        (err) => {
          console.error("Upload falhou:", err);
          if (
            err?.name === "FirebaseError" &&
            String(err).includes("canceled")
          ) {
            setError("Upload cancelado.");
          } else {
            setError("Erro ao enviar o vídeo.");
          }
          setIsUploading(false);
        },
        async () => {
          // terminou com sucesso
          if (thumbBlob) {
            try {
              await uploadBytes(thumbRef, thumbBlob, {
                contentType: "image/jpeg",
              });
            } catch (thumbErr) {
              console.error("Falha ao enviar thumbnail:", thumbErr);
            }
          }

          // mantém compatibilidade: envia ao menos `src`
          onCreate?.({
            src: `videos/${filename}`,
            // downloadURL,
            // durationSec: duration ?? undefined,
            // sizeBytes: file.size,
            // mime: file.type,
          });

          resetState();
          onClose();
        }
      );
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao enviar o vídeo.");
      setIsUploading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} sx={adminDialogSx}>
      <DialogTitle>Adicionar vídeo</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Dropzone */}
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            sx={{
              border: "1px dashed",
              borderColor: "rgba(255,255,255,0.24)",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "rgba(255,255,255,0.02)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
            }}
            onClick={() =>
              document.getElementById("video-input-hidden")?.click()
            }
          >
            <Stack alignItems="center" spacing={1}>
              <CloudUpload />
              <Typography variant="body1" fontWeight={600}>
                Arraste e solte o vídeo aqui
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou clique para selecionar (MP4, WEBM, MOV • até {maxSizeMB} MB)
              </Typography>
              <input
                id="video-input-hidden"
                type="file"
                accept={accept.join(",")}
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
            </Stack>
          </Box>

          {/* Preview + meta */}
          {file && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.24)",
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap title={file.name}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {file.type || "video"} • {humanSize(file.size)}
                    {typeof duration === "number"
                      ? ` • ${Math.round(duration)}s`
                      : ""}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="remover arquivo"
                  onClick={() => {
                    setFile(null);
                    if (videoURL) URL.revokeObjectURL(videoURL);
                    setVideoURL(null);
                    setDuration(null);
                  }}
                  disabled={isUploading}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

              {videoURL && (
                <Box sx={{ mt: 1 }}>
                  <video
                    src={videoURL}
                    controls
                    muted
                    style={{ width: "100%", maxHeight: 260, borderRadius: 8 }}
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget as HTMLVideoElement;
                      if (!isNaN(v.duration)) setDuration(v.duration);
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Progresso */}
          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" color="text.secondary">
                Enviando… {uploadProgress}%
              </Typography>
            </Box>
          )}

          {/* Erro */}
          {error && (
            <Typography sx={{ mt: 2 }} color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
          {isUploading ? (
            <Button
              variant="outlined"
              sx={adminSecondaryButtonSx}
              onClick={() => {
                if (taskRef.current) taskRef.current.cancel();
              }}
            >
              Cancelar envio
            </Button>
          ) : (
          <Button onClick={handleClose} variant="outlined" sx={adminSecondaryButtonSx}>
            Fechar
          </Button>
          )}
          <Button
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={handleSubmit as any}
            variant="contained"
            sx={adminPrimaryButtonSx}
            disabled={!file || isUploading}
          >
            Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
