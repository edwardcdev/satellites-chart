import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  TextField
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import axios from 'src/utils/axios';

interface CreateSystemModelProps {
  open: boolean;
  onClose(): void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CreateSystemModel: React.FC<CreateSystemModelProps> = ({ open, onClose }) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event) => setValue(event.currentTarget.value);

  const handleClick = async () => {
    const params = { system: value };
    await axios.post('/api/create-system', params);
    setValue('');
    onClose();
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose}>
      <DialogContent>
        <TextField label="System" value={value} onChange={handleChange} required />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" disabled={value.length < 3} onClick={handleClick}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSystemModel;
