import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Dialog,
  CssBaseline,
  DialogTitle as MuiDialogTitle,
  Typography,
  IconButton,
  DialogContent,
  Slide
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';

import DashAddon from '../../../../components/Button/DashAddon';
import SelectedChartSection from './SelectedChart';
import { MENU_ITEMS } from '../../../../constants';
import useStyles from '../../../../utils/styles';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MultiCharts: React.FC<any> = (props: {
  dataSet: string;
  size: { width: string; height: string };
  traces: any;
  dataType: string;
}) => {
  const [selected, setSelected] = useState<number[]>([1, 2, 3]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subChart, setSubChart] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const classes = useStyles();

  const handleSelected = (id: any) => {
    setSelected(
      selected.map((item: any, idx: any) => {
        if (idx === Number(index)) item = id;
        return item;
      })
    );
    setAnchorEl(null);
  };

  return (
    <>
      {selected.map((item: number, idx: number) => {
        let dset = MENU_ITEMS[props.dataSet][item].dataset;

        return (
          <Grid
            item
            md={6}
            key={item}
            style={{
              paddingLeft: '2rem',
              paddingRight: idx % 2 === 0 ? '2rem' : '0.8rem'
            }}
          >
            <Card style={{ height: `calc(${props.size.height} * 0.4)` }}>
              <CardContent>
                <DashAddon
                  type={1}
                  selected={selected}
                  anchorEl={anchorEl}
                  index={idx}
                  source={
                    props.traces[dset] && Object.keys(props.traces[dset]).length > 0
                      ? props.traces[dset]
                      : null
                  }
                  onIndex={(value: any) => setIndex(value)}
                  onAnchorEl={(value: any) => setAnchorEl(value)}
                  onSelected={(value: any) => handleSelected(value)}
                  onSubChart={(value: any) => {
                    setSubChart(value);
                    setIsOpen(true);
                  }}
                />
                <Grid item md={12}>
                  {props.traces[dset] && Object.keys(props.traces[dset]).length > 0 && (
                    <SelectedChartSection
                      id={item}
                      size={props.size}
                      data={props.traces[dset]}
                      dataType={props.dataType}
                      isSubChart={false}
                    />
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      {selected.length % 2 === 0 && <Grid item md={6} />}
      {subChart !== null && (
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            style: {
              height: Number(props.size.width.replace('px', '')) * 0.42,
              maxWidth: Number(props.size.width.replace('px', '')) * 0.6,
              minWidth: Number(props.size.width.replace('px', '')) * 0.6
            }
          }}
        >
          <CssBaseline />
          <MuiDialogTitle>
            <Typography component="strong" variant="h6">
              {MENU_ITEMS[props.dataSet][subChart].name}
            </Typography>
            <IconButton
              aria-label="Close"
              className={classes.dialogCloseBtn}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <hr />
          <DialogContent>
            {props.traces[MENU_ITEMS[props.dataSet][selected[subChart]].dataset] &&
              Object.keys(
                props.traces[MENU_ITEMS[props.dataSet][selected[subChart]].dataset]
              ).length > 0 && (
                <SelectedChartSection
                  id={selected[subChart]}
                  size={props.size}
                  dataType={props.dataType}
                  isSubChart={true}
                  data={
                    props.traces[MENU_ITEMS[props.dataSet][selected[subChart]].dataset]
                  }
                />
              )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MultiCharts;
