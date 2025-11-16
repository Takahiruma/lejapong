import React from "react";
import { Snackbar, Alert, type AlertColor, CircularProgress, Stack, Box } from "@mui/material";

export interface Toast {
  id: number;
  type: AlertColor | "loading";
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

interface ToasterProps {
  toasts: Toast[];
  onClose: (id: number) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, onClose }) => {
  return (
    <>
      {toasts.map(({ id, type, title, description, duration = 3000, closable }, index) => (
        <Snackbar
          key={id}
          open
          autoHideDuration={type === "loading" ? null : duration}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={() => onClose(id)}
          sx={{ mb: 1, mr: 1, width: 360 }}
        >
          {type === "loading" ? (
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 1,
                padding: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                boxShadow: 3,
              }}
            >
              <CircularProgress size={20} color="primary" />
              <Stack spacing={0.5}>
                {title && <Box fontWeight="bold">{title}</Box>}
                {description && <Box fontSize="0.875rem">{description}</Box>}
              </Stack>
            </Box>
          ) : (
            <Alert
              severity={type}
              onClose={closable ? () => onClose(id) : undefined}
              variant="filled"
              elevation={6}
              sx={{ width: "100%" }}
            >
              {title && <strong>{title}</strong>}
              {description && <div>{description}</div>}
            </Alert>
          )}
        </Snackbar>
      ))}
    </>
  );
};
