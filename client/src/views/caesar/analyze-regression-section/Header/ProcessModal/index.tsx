import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  IconButton,
  Grid,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { blue } from '@material-ui/core/colors';
import SystemDetailsSection from './SystemDetails';
import ModelDetailsSection from './ModelDetails';
import useStyles from 'src/utils/styles';
import NewDataSection from './NewData';
import { processing } from 'src/API';
import { BASE_URL } from 'src/constants';

interface ProcessModalProps {
  isOpen: boolean;
  onClose(): void;
}

interface ISource {
  name: string;
  size: number;
  status: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ProcessModal: React.FC<ProcessModalProps> = (props) => {
  const [system, setSystem] = useState<number>(-1);
  const [expanded, setExpanded] = useState<string>('panel1');
  const [uploadedItems, setUploadedItems] = useState<File[]>([]);
  const [listening, setListening] = useState<boolean>(false);
  const [source, setSource] = useState<Array<any>>([]);
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    if (!listening) {
      const events = new EventSource(BASE_URL + '/api/events');
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setSource((nests) => nests.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, source]);

  const handleClick = () => {
    const formData = new FormData();

    uploadedItems.forEach((file: File) => {
      formData.append('upload', file);
    });

    processing(formData);
    setListening(false);
  };

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => props.onClose()}
      aria-labelledby="modify-slide-title"
      aria-describedby="modify-slide-description"
      classes={{ paper: classes.dialogModify }}
    >
      <DialogTitle
        disableTypography
        style={{ backgroundColor: blue[700], color: '#fff', fontSize: 20 }}
      >
        {`Add or Modify Data`}
        <IconButton
          onClick={() => props.onClose()}
          style={{ position: 'absolute', right: 10, padding: 0 }}
        >
          <HighlightOffIcon style={{ color: '#fff' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <Grid container justify="center" alignItems="center">
              <Grid item md={12}>
                <SystemDetailsSection
                  expanded={expanded}
                  system={system}
                  onChange={(value: string) => setExpanded(value)}
                  onChangeSystem={(value: number) => setSystem(value)}
                />
              </Grid>
              <Grid item md={12}>
                <ModelDetailsSection
                  system={system}
                  expanded={expanded}
                  onChangeSystem={(value: number) => setSystem(value)}
                  onChange={(value: string) => setExpanded(value)}
                />
              </Grid>
              <Grid item md={12}>
                <NewDataSection
                  expanded={expanded}
                  uploadedItems={uploadedItems}
                  onChange={(value: string) => setExpanded(value)}
                  onChangeUploadedItems={(file: File) =>
                    setUploadedItems((prevState) => [...prevState, file])
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Box
              border={1}
              style={{
                height: '10rem',
                backgroundColor: '#000',
                overflow: 'auto'
              }}
            >
              <Table size="small" aria-label="status table">
                <TableBody>
                  {source.map((row: ISource, idx: number) => (
                    <TableRow key={row.name + idx}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ color: '#fff', borderBottom: 0 }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right" style={{ color: '#fff', borderBottom: 0 }}>
                        {row.size}
                      </TableCell>
                      <TableCell align="right" style={{ color: '#fff', borderBottom: 0 }}>
                        {row.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary">
          Process
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessModal;
