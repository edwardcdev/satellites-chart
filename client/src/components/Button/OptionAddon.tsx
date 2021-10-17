import React, { useState } from "react";
import { CSVLink } from "react-csv";
import {
  Grid,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import LaunchIcon from "@material-ui/icons/Launch";

import useStyles from "../../utils/styles";
import { grey } from "@material-ui/core/colors";

function OptionAddon (props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center" spacing={2}>
      <Grid item md={4}>
        <Typography
          component="p"
          style={{
            textAlign: "end",
            position: "absolute",
            left: 10,
            top: 10,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            className="mt-2 mb-2"
            style={{ fontSize: 11 }}
          >
            {`Graph Options`}
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Typography>
      </Grid>
      <Grid item md={6} />
      {props.isDash && (
        <Grid item md={1}>
          <IconButton
            style={{
              padding: 0,
              position: "absolute",
              right: 10,
              top: 10,
            }}
            onClick={() => props.onChart()}
          >
            <LaunchIcon />
          </IconButton>
          <IconButton
            style={{
              padding: 0,
              position: "absolute",
              right: 50,
              top: 12,
            }}
          >
            <CSVLink
              data={props.source.plot_value}
              filename={`Plot-${Date.now()}.csv`}
              className="btn btn-primary"
              target="_blank"
            >
              <Typography component="p" variant="body2">
                {"csv"}
              </Typography>
            </CSVLink>
          </IconButton>
        </Grid>
      )}
      {isOpen && (
        <Grid item md={11}>
          <Box
            borderColor="primary.main"
            border={2}
            borderRadius={5}
            padding={2}
          >
            <Grid container justify="center" alignItems="center" spacing={2}>
              <Grid item md={3}>
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item md={5}>
                    <Button
                      id={props.type}
                      name="2d_view"
                      variant="outlined"
                      size="small"
                      style={{
                        backgroundColor:
                          props.viewMethod !== "3d_view"
                            ? grey[300]
                            : "inherit",
                      }}
                      onClick={(e) => props.onViewMethod(e)}
                      fullWidth
                    >
                      {"2D"}
                    </Button>
                  </Grid>
                  <Grid item md={7} />
                  <Grid item md={5}>
                    <Button
                      name="3d_view"
                      variant="outlined"
                      size="small"
                      style={{
                        backgroundColor:
                          props.viewMethod === "3d_view"
                            ? grey[300]
                            : "inherit",
                      }}
                      onClick={(e) => props.onViewMethod(e)}
                      fullWidth
                    >
                      {"3D"}
                    </Button>
                  </Grid>
                  <Grid item md={7} />
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={5} style={{ marginRight: 15 }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-outlined-label">{`Inclination`}</InputLabel>
                  <Select
                    labelId="inclination-label"
                    id="inclination-label"
                    value={props.inc}
                    onChange={(e) => props.onInc(e.target.value)}
                    label="Inclination"
                    defaultValue=""
                    disabled={props.viewMethod === "3d_view"}
                  >
                    <MenuItem value="" disabled>
                      <em>{`None`}</em>
                    </MenuItem>
                    {props.incs.map((item: number) => (
                      <MenuItem key={`inclination-${item}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={3}>
                <Tooltip
                  title={
                    <Typography
                      gutterBottom
                      component="p"
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: "Reset 3D plot",
                      }}
                    />
                  }
                  placement="top-start"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <span>
                    <Button
                      id={props.type}
                      name="Reset"
                      variant="outlined"
                      size="small"
                      disabled={props.viewMethod === "2d_view" ? true : false}
                      onClick={() => props.resetPlot()}
                      fullWidth
                    >
                      {"Reset"}
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default OptionAddon;
