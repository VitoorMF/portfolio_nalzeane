// addProductDialog.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export interface NewProductValues {
  id: string;
  image: string;
  link: string;
  name: string;
}

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: NewProductValues) => void;
  socialId: string; // novo id gerado
}

export default function AddProductDialog({
  open,
  onClose,
  onCreate,
  socialId,
}: AddProductDialogProps) {
  const [image, setImage] = React.useState("");
  const [link, setLink] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim() || !link.trim() || !name.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    const data: NewProductValues = {
      id: socialId,
      image: image.trim(),
      link: link.trim(),
      name: name.trim(),
    };
    setError(null);
    onCreate?.(data);
    onClose();
  };

  React.useEffect(() => {
    if (!open) {
      setImage("");
      setLink("");
      setName("");
      setError(null);
    }
  }, [open]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Adicionar Produto</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            disabled
            margin="dense"
            name="id"
            label="ID"
            fullWidth
            variant="standard"
            value={socialId}
          />
          <TextField
            required
            margin="dense"
            name="image"
            label="Imagem (URL)"
            fullWidth
            variant="standard"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="link"
            label="Link"
            fullWidth
            variant="standard"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
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
