import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText } from "@mui/material";
import {
  adminDangerButtonSx,
  adminDialogSx,
  adminSecondaryButtonSx,
} from "./adminDialogStyles";

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
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} sx={adminDialogSx}>
      <DialogTitle id="alert-dialog-title">{"Excluir Parceiro?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: "#cbd5e1" }}>
          Você tem certeza que deseja excluir este parceiro? Esta ação não pode
          ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={adminSecondaryButtonSx}>
          Cancelar
        </Button>
        <Button autoFocus onClick={onConfirm} variant="outlined" sx={adminDangerButtonSx}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
