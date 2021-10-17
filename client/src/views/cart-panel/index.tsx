import React, { useState, useEffect } from "react";

import {
  Grid,
  CssBaseline,
  Slide,
  Typography,
  IconButton,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { Close as CloseIcon } from "@material-ui/icons";

import { getCartItems } from "../../API";
import useStyles from "../../utils/styles";
import AnalyzeRegressionSection from "./analyze-regression-section";

const INIT_PARAMS = {
  altitude: 300,
  availabilityThreshold: 0.999,
  dataVolumeNeed: 0.1,
  gapThreshold: 6,
  inclination: 0,
  latitude: 30,
  launchYear: 2030,
  longitude: 30,
  navAccuracyNeed: 20,
  powerAmplifier: 1,
  value: 100,
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function CartPanel(props: any) {
  const [source, setSource] = useState({} as any);
  const [dataSource, setDataSource] = useState({} as any);
  const [system, setSystem] = useState(5 as any);
  const [version, setVersion] = useState(3 as any);
  const [inclination, setInclination] = useState("");
  const [incs, setIncs] = useState([] as any);
  const [dataType, setDataType] = useState("coverage" as any);
  const [isLoading, setIsLoading] = useState(true);
  const [maxAltitude, setMaxAltitude] = useState(0);
  const [text, setText] = useState("");
  const deepDive = "system1/coverage";
  const metric = deepDive.split("/")[1];
  const missionType = "orbital";
  const classes = useStyles();

  useEffect(() => {
    setText("");
    getCartItems({
      type: missionType,
      system: system,
      version: version,
      dataType,
    })
      .then((res: any) => {
        setSource(res.data.data);
        setDataSource(res.data.data);
        setMaxAltitude(res.data.maxAltitude);
        setText(res.data.text);

        // TODO: active when used
        // setTerrestrial(res.data.terrestrial);
        // setCoefficients(res.data.coefficients);

        if (Object.keys(res.data.data).includes("plot_value")) {
          let tmp = res.data.data.plot_value.map(
            (item: any) => item["inclination"]
          );
          let uniqueArray: Array<any> = [...new Set(tmp)  as any];
          setIncs(uniqueArray.sort());
        }

        // FIXME: there is no real data for it.
        //
        // setText(
        //   props.equationsTex[system.replace(" ", "_").toLowerCase()][metric](
        //     data["coefficients"][metric]
        //   )
        // );
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [system, version, dataType]);

  useEffect(() => {
    if (Object.keys(dataSource).includes("plot_value")) {
      let data = dataSource.plot_value.filter(
        (item: any) => item.inclination === inclination
      );
      setSource((prevState: any) => ({ ...prevState, plot_value: data }));
    }
  }, [inclination, dataSource]);

  const equation = (inc: any, alt: any, metric: string) => {
    // FIXME: activate in integration of cart.
    //
    // const altitude = parseFloat(alt);
    // const inclination = parseFloat(inc);

    // const coefs = coefficients[metric];
    // const eqn = props.equations[system.replace(" ", "_").toLowerCase()][metric];

    // return eqn(coefs, altitude, inclination);
    return inc;
  };

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      onClose={() => props.onClose()}
      classes={{ paper: classes.dialogDeep }}
    >
      <CssBaseline />
      <MuiDialogTitle>
        <Typography component="strong" variant="h6">
          {"Cart Integration Panel"}
        </Typography>
        <IconButton
          aria-label="Close"
          className={classes.dialogCloseBtn}
          onClick={() => props.onClose()}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent
        dividers={true}
        style={{ paddingRight: 0, paddingLeft: 0, overflowX: "hidden" }}
      >
        <Grid container justify="center" alignItems="center">
          <Grid item md={12}>
            {!isLoading &&
              (missionType === "orbital" ? (
                <AnalyzeRegressionSection
                  equation={(x: any, y: any, m: any) => equation(x, y, m)}
                  maxAltitude={maxAltitude}
                  alt={INIT_PARAMS.altitude}
                  inc={INIT_PARAMS.inclination}
                  value={INIT_PARAMS.value}
                  data={source}
                  source={dataSource}
                  dataType={dataType}
                  selectedItem={metric}
                  text={text}
                  system={system}
                  version={version}
                  inclination={inclination}
                  incs={incs}
                  onInc={(value: any) => setInclination(value)}
                  onSystem={(value: any) => setSystem(value)}
                  onVersion={(value: any) => setVersion(value)}
                  onDataType={(value: any) => setDataType(value)}
                />
              ) : (
                <></>
              ))}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CartPanel;
