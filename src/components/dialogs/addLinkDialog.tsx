// addProductDialog.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export interface NewLinkValues {
  id: string;
  url: string;
  name: string;
}

interface AddLinkDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: NewLinkValues) => void;
  socialId: string;
}

export default function AddLinkDialog({
  open,
  onClose,
  onCreate,
  socialId,
}: AddLinkDialogProps) {
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !name.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    const data: NewLinkValues = {
      id: socialId,
      url: url.trim(),
      name: name.trim(),
    };
    setError(null);
    onCreate?.(data);
    onClose();
  };

  React.useEffect(() => {
    if (!open) {
      setUrl("");
      setName("");
      setError(null);
    }
  }, [open]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Adicionar Link</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            required
            margin="dense"
            name="name"
            label="Nome"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="src"
            label="Src"
            fullWidth
            variant="standard"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          <DialogActions sx={{ paddingTop: 2 }}>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
