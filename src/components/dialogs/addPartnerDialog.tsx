// addProductDialog.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  adminDialogSx,
  adminPrimaryButtonSx,
  adminSecondaryButtonSx,
} from "./adminDialogStyles";

export interface NewPartnerValues {
  id: string;
  src: string;
  name: string;
}

interface AddPartnerDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: NewPartnerValues) => void;
  socialId: string;
}

export default function AddPartnerDialog({
  open,
  onClose,
  onCreate,
  socialId,
}: AddPartnerDialogProps) {
  const [src, setSrc] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim() || !name.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    const data: NewPartnerValues = {
      id: socialId,
      src: src.trim(),
      name: name.trim(),
    };
    setError(null);
    onCreate?.(data);
    onClose();
  };

  React.useEffect(() => {
    if (!open) {
      setSrc("");
      setName("");
      setError(null);
    }
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} sx={adminDialogSx}>
      <DialogTitle>Adicionar Parceiro</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            required
            margin="dense"
            name="name"
            label="Nome"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="src"
            label="URL da imagem"
            fullWidth
            variant="outlined"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />

          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          <DialogActions sx={{ paddingTop: 2 }}>
            <Button type="button" onClick={onClose} variant="outlined" sx={adminSecondaryButtonSx}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={adminPrimaryButtonSx}>Criar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
