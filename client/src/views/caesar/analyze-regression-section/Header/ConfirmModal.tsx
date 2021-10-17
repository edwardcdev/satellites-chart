import React, { useState, useEffect, FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

interface ConfirmModalProps {
  open: boolean;
  name: string;
  onClose(): void;
  onChangeAgree(): void;
}

const statement = [
  { name: 'delete', value: 'Are you sure to delete selected records?' },
  { name: 'deleteAll', value: 'Are you sure to delete all records for selected system?' },
  { name: 'migrate', value: 'Are you sure to transfer all records to production database?' }
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ConfrimModal: FC<ConfirmModalProps> = ({
  open,
  name,
  onClose,
  onChangeAgree
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (name) {
      const des = statement.find((el) => el.name === name);
      setValue(des.value);
    }
  }, [name]);

  const handleClick = () => {
    onChangeAgree();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <DialogContentText>{value}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfrimModal;
