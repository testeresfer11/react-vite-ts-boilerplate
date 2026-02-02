import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/Elements';

export type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
};

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  isLoading = false,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: '0.5rem' },
      }}
    >
      <DialogTitle className="text-center mt-3 semi-bold f-20">{title}</DialogTitle>
      <DialogContent>
        <div className="text-center mb-3 text-muted">{body}</div>
      </DialogContent>
      <DialogActions className="justify-content-center pb-4 gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelButtonText}
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;