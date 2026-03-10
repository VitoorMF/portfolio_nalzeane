import type { SxProps, Theme } from "@mui/material/styles";

export const adminDialogSx: SxProps<Theme> = {
  "& .MuiPaper-root": {
    borderRadius: 3,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, #252525 0%, #1d1d1d 100%)",
    color: "#f3f4f6",
    boxShadow: "0 22px 56px rgba(0,0,0,0.35)",
  },
  "& .MuiDialogTitle-root": {
    fontWeight: 700,
    letterSpacing: "0.01em",
    paddingBottom: 1,
  },
  "& .MuiDialogContent-root": {
    paddingTop: 1,
  },
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputBase-root": {
    color: "#f8fafc",
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.22)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.35)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3ddc97",
  },
  "& .MuiFormHelperText-root": {
    color: "#fca5a5",
  },
};

export const adminPrimaryButtonSx: SxProps<Theme> = {
  borderRadius: 2,
  px: 2,
  fontWeight: 700,
  textTransform: "none",
  color: "#fff",
  background: "linear-gradient(135deg, #0f172a, #1f2937)",
  "&:hover": {
    background: "linear-gradient(135deg, #111827, #374151)",
  },
};

export const adminSecondaryButtonSx: SxProps<Theme> = {
  borderRadius: 2,
  px: 2,
  textTransform: "none",
  color: "#e5e7eb",
  borderColor: "rgba(255,255,255,0.24)",
};

export const adminDangerButtonSx: SxProps<Theme> = {
  borderRadius: 2,
  px: 2,
  textTransform: "none",
  color: "#fecaca",
  borderColor: "rgba(252,165,165,0.35)",
  "&:hover": {
    borderColor: "rgba(252,165,165,0.6)",
    backgroundColor: "rgba(127,29,29,0.22)",
  },
};
