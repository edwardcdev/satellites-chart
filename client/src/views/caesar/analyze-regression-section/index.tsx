import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Slide,
  Dialog,
  DialogContent,
  CssBaseline,
  DialogTitle as MuiDialogTitle,
  IconButton
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';
import TwoViewSection from './TwoViewChart';
import ThreeViewSection from './ThreeViewChart';
import MultiCharts from './MultiCharts';
import Header from './Header';
import OptionAddon from '../../../components/Button/OptionAddon';
import { getItems, getSystems, getFileId, changeDB } from '../../../API';
import useStyles from '../../../utils/styles';

interface IDot {
  x: number;
  y: number;
}

interface ICount {
  width: string;
  height: string;
}

interface IFileId {
  id: number;
}

const INIT_CHECK_STATUS = {
  show_surface: true,
  show_scatter: true
};

const viewStyle = {
  paddingLeft: '2rem',
  paddingRight: '0.8rem'
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AnalyzeRegressionSection: React.FC<any> = (props: any) => {
  const [viewMethod, setViewMethod] = useState<string>('2d_view');
  const [dataSet, setDataSet] = useState<string>('as_needed_handoff');
  const [systems, setSystems] = useState<string[]>([]);
  const [versions, setVersions] = useState<number[]>([]);
  const [db, setDB] = useState<string>('staging_db');
  const [dot, setDot] = useState<IDot>({ x: props.alt, y: props.value });
  const [fileId, setFileId] = useState<IFileId[]>([]);
  const [checked, setChecked] = useState(INIT_CHECK_STATUS);
  const [traces, setTraces] = useState<any>({});
  const [reset, setReset] = useState<boolean>(false);
  const [count, setCount] = useState<ICount>({ width: '0px', height: '0px' });
  const [isChart, setIsChart] = useState(false);
  const classes = useStyles();
  const chartEl = useRef<any>(null);
  const plot_rows = props.data.plot_value;
  const surface_rows: number[] = [];
  const zAxisLabel = props.data.label;

  useEffect(() => {
    getSystems()
      .then((res: any) => {
        setSystems(res.data);
        props.onSystem(res.data[1].system_id);
      })
      .catch((err: any) => setSystems([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isRefresh, db]);

  useEffect(() => {
    if (fileId.length > 0) {
      getItems({
        dataType: props.dataType,
        fileId: fileId,
        version: props.version
      })
        .then((res) => {
          Object.keys(res.data).forEach((el: string) => {
            let ctype: string = res.data[el]['type'];
            let gaps: number[] = [];
            let durations: number[] = [];
            let avgs: number[] = [];

            // Detect chart type and set Traces
            if (ctype === 'line') {
              res.data[el]['data'].forEach((item: number[], idx: number) => {
                gaps.push(idx + 1);
                durations.push(item[0]);
                avgs.push(item[1]);
              });

              setTraces((prevState: any) => ({
                ...prevState,
                [el]: {
                  xTraces: gaps,
                  yTraces: durations,
                  avgTraces: avgs,
                  type: ctype,
                  title: res.data[el]['title']
                }
              }));
            } else if (ctype === 'histogram') {
              setTraces((prevState: any) => ({
                ...prevState,
                [el]: {
                  xTraces: res.data[el]['data'],
                  type: ctype,
                  title: res.data[el]['title']
                }
              }));
            }
          });
        })
        .catch(() => {
          setTraces({});
        });
    }
  }, [props.dataType, props.version, fileId]);

  useEffect(() => {
    let user_inclination: number | string =
      props.inclination !== '' ? props.inclination : 30;

    const params = {
      user_altitude: dot.x,
      user_inclination,
      system: props.system,
      version: props.version
    };

    getFileId(params)
      .then((res: any) => setFileId(res.data))
      .catch(() => setFileId([]));
  }, [props.inclination]);

  useEffect(() => {
    changeDB({ database: db }).catch((err) => setDB('staging_db'));
    setDataSet('as_needed_handoff');
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { system: props.system };
        const response = await axios.post('/api/get-versions', params);

        setVersions(response.data);
        props.onVersion(response.data[0].versions);
      } catch (error) {
        setVersions([]);
      }
    };
    props.system !== '' && fetchData();
  }, [props.system]);

  useEffect(() => {
    if (props.data.plot_value.length > 0)
      setDot({
        x: props.data.plot_value[0].altitude,
        y: props.data.plot_value[0].value
      });
  }, [props.data]);

  useEffect(() => {
    if (chartEl) {
      let size = window.getComputedStyle(chartEl.current);
      setCount({ width: size.width, height: size.height });
    }
  }, [chartEl, traces]);

  const handleCheck = (event: any) => {
    const { name, checked } = event.currentTarget;
    setChecked((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handleDataSetClick = (event: any) => {
    event.preventDefault();
    const { id, name } = event.currentTarget;

    setDataSet(id);
    props.onDataType(name);
  };

  const handleClick = (event: any) => {
    if (event) {
      const params = {
        user_altitude: event.points[0].x,
        user_inclination: props.inc,
        system: props.system,
        version: props.version
      };

      setDot({ x: event.points[0].x, y: event.points[0].y });
      getFileId(params)
        .then((res: any) => setFileId(res.data))
        .catch((err: any) => setFileId([]));
    }
  };

  return (
    <>
      <CardContent
        ref={chartEl}
        className={classes.cartCardContent}
        style={{ overflow: 'hidden' }}
      >
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Header
            db={db}
            system={props.system}
            systems={systems}
            version={props.version}
            versions={versions}
            dataSet={dataSet}
            alt={dot.x}
            inc={props.inclination !== '' ? props.inclination : props.inc}
            fileId={fileId}
            onRefresh={() => props.onRefresh()}
            onSetDB={(value: string) => setDB(value)}
            onSystem={(value: number) => props.onSystem(value)}
            onVersion={(value: number) => props.onVersion(value)}
            onClick={handleDataSetClick}
          />
          <Grid item md={6} style={viewStyle}>
            <Card style={{ height: `calc(${count.height} * 0.4)` }}>
              <CardContent>
                <Grid container justify="center" spacing={2}>
                  <Grid
                    item
                    md={12}
                    style={{ textAlign: 'center', position: 'relative' }}
                  >
                    <Typography
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold'
                      }}
                    >
                      {dataSet === 'as_needed_handoff'
                        ? `RF Coverage (%)`
                        : `No Coverage (%)`}
                      {` vs. User Inclination`}
                    </Typography>
                    <OptionAddon
                      source={props.data}
                      dataSource={props.source}
                      checked={checked}
                      viewMethod={viewMethod}
                      inc={props.inclination}
                      incs={props.incs}
                      isDash={true}
                      onChecked={handleCheck}
                      onChart={() => setIsChart(true)}
                      resetPlot={() => setReset(!reset)}
                      onInc={(value: any) => props.onInc(value)}
                      onViewMethod={(e: any) =>
                        setViewMethod(e.currentTarget.name)
                      }
                    />
                  </Grid>
                  {viewMethod === '3d_view' ? (
                    <Grid item md={12}>
                      <ThreeViewSection
                        data={props.source}
                        equation={props.equation}
                        maxAltitude={props.maxAltitude}
                        alt={props.alt}
                        inc={
                          props.inclination !== ''
                            ? props.inclination
                            : props.inc
                        }
                        value={props.value}
                        reset={reset}
                        isLegend={false}
                        isSub={true}
                        plot_rows={props.source.plot_value}
                        surface_rows={surface_rows}
                        zAxisLabel={zAxisLabel}
                        checked={checked}
                        size={count}
                        isChart={false}
                        onClick={handleClick}
                      />
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      <TwoViewSection
                        data={props.data}
                        equation={props.equation}
                        maxAltitude={props.maxAltitude}
                        alt={dot.x}
                        inc={
                          props.inclination !== ''
                            ? props.inclination
                            : props.inc
                        }
                        value={props.value}
                        isLegend={false}
                        isSub={true}
                        plot_rows={plot_rows}
                        surface_rows={surface_rows}
                        yAxisLabel={zAxisLabel}
                        dot={dot}
                        size={count}
                        checked={checked}
                        isChart={false}
                        onClick={handleClick}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {fileId.length === 0 && <Grid item md={6} />}
          {Object.keys(traces).length > 0 && (
            <MultiCharts
              traces={traces}
              dataSet={dataSet}
              dataType={props.dataType}
              size={count}
            />
          )}
        </Grid>
      </CardContent>
      {isChart && (
        <Dialog
          open={isChart}
          TransitionComponent={Transition}
          onClose={() => setIsChart(true)}
          PaperProps={{
            style: {
              height: parseFloat(count.width.replace('px', '')) * 0.42,
              maxWidth: parseFloat(count.width.replace('px', '')) * 0.6,
              minWidth: parseFloat(count.width.replace('px', '')) * 0.6
            }
          }}
        >
          <CssBaseline />
          <MuiDialogTitle>
            <Typography component="strong" variant="h6">
              {dataSet === 'as_needed_handoff'
                ? `RF Coverage (%)`
                : `No Coverage (%)`}
              {` vs. User Inclination`}
            </Typography>
            <IconButton
              aria-label="Close"
              className={classes.dialogCloseBtn}
              onClick={() => setIsChart(false)}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <hr />
          <DialogContent>
            {viewMethod === '3d_view' ? (
              <Grid item md={12}>
                <ThreeViewSection
                  data={props.source}
                  equation={props.equation}
                  maxAltitude={props.maxAltitude}
                  alt={props.alt}
                  inc={props.inclination !== '' ? props.inclination : props.inc}
                  value={props.value}
                  reset={reset}
                  isLegend={false}
                  isSub={true}
                  plot_rows={props.source.plot_value}
                  surface_rows={surface_rows}
                  zAxisLabel={zAxisLabel}
                  checked={checked}
                  size={count}
                  isChart={true}
                  onClick={handleClick}
                />
              </Grid>
            ) : (
              <Grid item md={12}>
                <TwoViewSection
                  data={props.data}
                  equation={props.equation}
                  maxAltitude={props.maxAltitude}
                  alt={props.alt}
                  inc={props.inclination !== '' ? props.inclination : props.inc}
                  value={props.value}
                  isLegend={false}
                  isSub={true}
                  plot_rows={plot_rows}
                  surface_rows={surface_rows}
                  yAxisLabel={zAxisLabel}
                  dot={dot}
                  size={count}
                  checked={checked}
                  isChart={true}
                  onClick={handleClick}
                />
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AnalyzeRegressionSection;
