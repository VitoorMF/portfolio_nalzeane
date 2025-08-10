import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export interface ProductValues {
  id: string;
  image: string;
  link: string;
  name: string;
}

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductValues) => void;
  onDelete?: (id: string) => void;
  socialId?: string;
  socialImage?: string;
  socialLink?: string;
  socialName?: string;
}

export default function ProductDialog({
  open,
  onClose,
  onSubmit,
  onDelete,
  socialId = "",
  socialImage = "",
  socialLink = "",
  socialName = "",
}: ProductDialogProps) {
  const [id, setId] = React.useState(socialId);
  const [image, setImage] = React.useState(socialImage);
  const [link, setLink] = React.useState(socialLink);
  const [name, setName] = React.useState(socialName);
  const [error, setError] = React.useState<string | null>(null);

  // Sincroniza quando as props mudam
  React.useEffect(() => {
    setId(socialId);
    setImage(socialImage);
    setLink(socialLink);
    setName(socialName);
  }, [socialImage, socialLink, socialName, socialId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const imageTrimmed = image.trim();
    const linkTrimmed = link.trim();
    const nameTrimmed = name.trim();

    if (!imageTrimmed || !linkTrimmed || !nameTrimmed) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const data: ProductValues = {
      id,
      image: imageTrimmed,
      link: linkTrimmed,
      name: nameTrimmed,
    };

    setError(null);
    onSubmit?.(data);
    onClose();
  };

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Editar Produto</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            disabled
            margin="dense"
            name="id"
            label="ID"
            fullWidth
            variant="standard"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="image"
            label="Imagem"
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
            name="nome"
            label="Nome"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Button
              color="error"
              onClick={handleDelete}
              disabled={!onDelete || !id}
            >
              Excluir
            </Button>

            <div>
              <Button type="button" onClick={onClose}>
                Fechar
              </Button>
              <Button type="submit">Confirmar</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
