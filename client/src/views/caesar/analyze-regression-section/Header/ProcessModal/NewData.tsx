import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Accordion, AccordionSummary, AccordionDetails } from './CustomAccordion';

interface ModelDetailsProps {
  expanded: string;
  uploadedItems: File[];
  onChangeUploadedItems(param: File): void;
  onChange(param: string): void;
}

const NewData: React.FC<ModelDetailsProps> = (props) => {
  const handleUploadFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    const element: HTMLElement | null = document.getElementById('upload');
    element && element.click();
  };

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const element = document.getElementById('upload') as HTMLInputElement;
    const files: FileList | null = element?.files;

    if (files && files[0]) {
      props.onChangeUploadedItems(files[0]);
    }
  };

  return (
    <Accordion
      square
      expanded={props.expanded === 'panel3'}
      onChange={() => props.onChange('panel3')}
    >
      <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
        <Typography>{'3. New Data'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md={9}>
            <Typography style={{ fontSize: '14px' }}>
              {`a. Data to be downloaded (Select files or drop files in square)`}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <Button
              name="file_select_btn"
              size="small"
              variant="outlined"
              onClick={handleUploadFile}
            >
              {'Select Files'}
            </Button>
            <input
              id="upload"
              type="file"
              accept="*"
              onChange={handleUploadedFile}
              style={{ display: 'none' }}
            />
          </Grid>
          <Grid item md={12}>
            <Box
              border={1}
              style={{ height: '6rem', borderColor: blue[500], overflow: 'auto' }}
            >
              <Table size="small" aria-label="uploaded files table">
                <TableBody>
                  {props.uploadedItems.map((row: File) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default NewData;
