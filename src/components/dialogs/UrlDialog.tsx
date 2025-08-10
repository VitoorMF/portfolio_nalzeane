import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

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

  React.useEffect(() => {
    setUrl(socialUrl);
    setName(socialName);
  }, [socialUrl, socialName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedName = name.trim();
    if (!trimmedName) {
      console.warn("Nome é obrigatório.");
      return;
    }
    if (!trimmedUrl) {
      console.warn("URL é obrigatória.");
      return;
    }
    onSubmit?.({ url: trimmedUrl, name: trimmedName });
    onClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
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
            variant="standard"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <DialogActions sx={{ justifyContent: "space-between" }}>
            <div>
              {canDelete && (
                <Button
                  type="button"
                  color="error"
                  onClick={() => {
                    onDelete?.();
                  }}
                >
                  Excluir
                </Button>
              )}
            </div>
            <div>
              <Button type="button" onClick={onClose}>
                Fechar
              </Button>
              <Button type="submit">Alterar</Button>
            </div>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
