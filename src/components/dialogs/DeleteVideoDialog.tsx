// addProductDialog.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

import "./addVideoDialog.css";

export interface NewVideoValues {
  src: string;
}

interface AddVideoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: NewVideoValues) => void;
}

export default function AddVideoDialog({
  open,
  onClose,
  onCreate,
}: AddVideoDialogProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const storage = getStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 5) upload propriamente dito
  const handleUpload = () => {
    if (!file) return;
    const filename = `${Date.now()}`;
    const videoRef = ref(storage, `videos/${filename}`);
    const task = uploadBytesResumable(videoRef, file);

    task.on(
      "state_changed",
      (snap) => {
        const prog = (snap.bytesTransferred / snap.totalBytes) * 100;
        setUploadProgress(Math.round(prog));
      },
      (err) => {
        console.error("Upload falhou:", err);
        setError("Erro ao enviar o vídeo.");
      },
      () => {
        // Ao terminar o upload COM SUCESSO:
        onCreate?.({
          src: `videos/${filename}`,
        });

        setFile(null); // limpa o arquivo
        setUploadProgress(0);
        setError(null); // limpa o erro
        onClose(); // fecha o diálogo
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo antes de enviar.");
      return;
    }
    setError(null);
    handleUpload();
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Adicionar Vídeo</DialogTitle>
      <DialogContent className="dialog_content">
        <form className="form_dialog" onSubmit={handleSubmit} noValidate>
          <input
            className="file_input"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />

          <button className="send" type="submit" disabled={!file}>
            Enviar
          </button>

          {file && (
            <div className="progress">
              <div className="bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
