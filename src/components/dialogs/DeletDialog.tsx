import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText } from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletDialog({
  open,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{"Excluir Parceiro?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Você tem certeza que deseja excluir este parceiro? Esta ação não pode
          ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button autoFocus onClick={onConfirm}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
