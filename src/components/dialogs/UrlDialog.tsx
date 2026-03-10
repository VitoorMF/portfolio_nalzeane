import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  adminDangerButtonSx,
  adminDialogSx,
  adminPrimaryButtonSx,
  adminSecondaryButtonSx,
} from "./adminDialogStyles";

interface FormValues {
  url: string;
  name: string;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormValues) => void;
  onDelete?: () => void; // novo
  canDelete?: boolean; // novo
  socialUrl?: string;
  socialName?: string;
}

export default function FormDialog({
  open,
  onClose,
  onSubmit,
  onDelete,
  canDelete = false,
  socialUrl = "",
  socialName = "",
}: FormDialogProps) {
  const [url, setUrl] = React.useState(socialUrl);
  const [name, setName] = React.useState(socialName);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUrl(socialUrl);
    setName(socialName);
    setError(null);
  }, [socialUrl, socialName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Nome é obrigatório.");
      return;
    }
    if (!trimmedUrl) {
      setError("URL é obrigatória.");
      return;
    }
    setError(null);
    onSubmit?.({ url: trimmedUrl, name: trimmedName });
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} sx={adminDialogSx}>
      <DialogTitle>Editar</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            autoFocus
            required
            margin="dense"
            name="url"
            label="URL"
            type="url"
            fullWidth
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={Boolean(error)}
          />
          <TextField
            required
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(error)}
            helperText={error ?? " "}
          />

          <DialogActions sx={{ justifyContent: "space-between" }}>
            <div>
              {canDelete && (
                <Button
                  type="button"
                  color="error"
                  variant="outlined"
                  sx={adminDangerButtonSx}
                  onClick={() => {
                    onDelete?.();
                  }}
                >
                  Excluir
                </Button>
              )}
            </div>
            <div>
              <Button type="button" onClick={onClose} variant="outlined" sx={adminSecondaryButtonSx}>
                Fechar
              </Button>
              <Button type="submit" variant="contained" sx={adminPrimaryButtonSx}>Alterar</Button>
            </div>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
