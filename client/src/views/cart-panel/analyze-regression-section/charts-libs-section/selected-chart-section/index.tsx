import React from "react";
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import LineChartSection from "../../../../chart-panel/line-chart-section";
import HistogramChartSection from "../../../../chart-panel/histogram-chart-section";
import BoxChartSection from "../../../../chart-panel/box-chart-section";

function createData(name: String, value: String) {
  return { name, value };
}

const rows = [
  createData("Average (sec)", "xx"),
  createData("Time-Averaged Gap", "xx"),
  createData("Median (sec)", "xx"),
  createData("Maximum (minutes)", "xx"),
  createData("Minimum (sec)", "xx"),
  createData("Average # Gaps Per Orbit", "xx"),
  createData("Average # Gaps Per Day", "xx"),
];

function SelectedChartSection(props: any) {
  return (
    <>
      {props.id === 0 && (
        <Grid container justify="center" alignItems="center">
          <Grid item md={10} style={{ textAlign: "center" }}>
            <Typography variant="h6">{`Key Metrics`}</Typography>
          </Grid>
          <Grid item md={10}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{`Gap Statistic`}</TableCell>
                  <TableCell>{`Value`}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      )}
      {props.id === 1 && (
        <LineChartSection source={props.data} dataType={props.dataType} />
      )}
      {props.id === 2 && <HistogramChartSection {...props.data} />}
      {props.id === 3 && <BoxChartSection {...props.data} />}
    </>
  );
}

export default SelectedChartSection;
