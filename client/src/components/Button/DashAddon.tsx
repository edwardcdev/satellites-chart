import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { Grid, IconButton, Typography } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import DehazeIcon from "@material-ui/icons/Dehaze";
import Selection from "../Select";

interface IDataSource {
  xTrace: number;
  yTrace?: number;
  avgTrace?: number;
}

const DashAddon: React.FC<any> = (props: any) => {
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (props.source) {
      let data: Array<any> = [];
      let csvTitle: string = props.source.title.split(" ").join("-");

      if (props.source.type === "line") {
        data = props.source.xTraces.map((item: number, idx: number) => {
          return {
            xTrace: item,
            yTrace: props.source.yTraces[idx],
            avgTrace: props.source.avgTraces[idx],
          };
        });
      } else {
        data = props.source.xTraces.map((item: number) => {
          return {
            xTrace: item,
          };
        });
      }
      setTitle(csvTitle);
      setDataSource(data);
    }
  }, [props.source]);

  return (
    <Grid item md={12}>
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        style={{ position: "relative" }}
      >
        <Grid item md={1}>
          <IconButton
            id={props.index}
            onClick={(e) => {
              props.onAnchorEl(e.currentTarget);
              props.onIndex(e.currentTarget.id);
            }}
            style={{ padding: 0 }}
          >
            <DehazeIcon />
          </IconButton>
          <Selection
            selected={props.selected}
            anchorEl={props.anchorEl}
            onAnchorEl={(value: any) => props.onAnchorEl(value)}
            onSelected={(value: any) => props.onSelected(value)}
          />
        </Grid>
        <Grid item md={10} />
        <Grid item md={1}>
          <IconButton
            style={{
              padding: 0,
              position: "absolute",
              right: 0,
              top: 10,
            }}
            onClick={() => props.onSubChart(props.index)}
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
            {props.source && (
              <CSVLink
                data={dataSource}
                filename={`${title}-${Date.now()}.csv`}
                className="btn btn-primary"
                target="_blank"
              >
                <Typography component="p" variant="body2">
                  {"csv"}
                </Typography>
              </CSVLink>
            )}
            {!props.source && (
              <Typography component="p" variant="body2">
                {"csv"}
              </Typography>
            )}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashAddon;
