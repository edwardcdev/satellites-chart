import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useWindowSize } from "../../../../utils/util";

function TwoViewSection(props: any) {
  const [checked, setChecked] = useState(props.checked);
  const [config, setConfig] = useState([]);
  const size: any = useWindowSize();
  const plot_rows = props.plot_rows;
  const surface_rows = props.surface_rows;

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  const unpack = (rows: Array<any>, key: any) => {
    return rows.map(function (row: any) {
      return row[key];
    });
  };
  
  useEffect(() => {
    let configData: any = [];
    const inclination = parseInt(props.inc);
    const new_plot_rows = plot_rows.filter(
      (row: any) => row.inclination === inclination
    );
    const new_surface_rows = surface_rows.filter(
      (row: any) => row.inclination === inclination
    );
    if (checked.show_surface === true && checked.show_scatter === true) {
      configData = [
        {
          x: unpack(new_plot_rows, "altitude"),
          y: unpack(new_plot_rows, "value"),
          name: "Model data",
          mode: "markers",
          type: "scatter",
          color: "rgb(23, 190, 207)",
        },
        {
          x: unpack(new_surface_rows, "altitude"),
          y: unpack(new_surface_rows, "value"),
          name: "Model curve",
          mode: "lines",
          line: {
            color: "rgb(252, 154, 7)",
          },
        },
        {
          x: [props.dot.x],
          y: [props.dot.y],
          name: "User",
          mode: "markers",
          type: "scatter",
          marker: {
            color: "red",
            size: 10,
          },
        },
      ];
    } else if (
      checked.show_surface === false &&
      checked.show_scatter === true
    ) {
      configData = [
        {
          x: unpack(new_plot_rows, "altitude"),
          y: unpack(new_plot_rows, "value"),
          name: "Model data",
          mode: "markers",
          type: "scatter",
          color: "rgb(23, 190, 207)",
        },
        {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
        },
        {
          x: [props.dot.x],
          y: [props.dot.y],
          name: "User",
          mode: "markers",
          type: "scatter",
          marker: {
            color: "red",
            size: 10,
          },
        },
      ];
    } else if (
      checked.show_surface === true &&
      checked.show_scatter === false
    ) {
      configData = [
        {
          x: unpack(new_surface_rows, "altitude"),
          y: unpack(new_surface_rows, "value"),
          name: "Model curve",
          mode: "lines",
          line: {
            color: "rgb(252, 154, 7)",
          },
        },
        {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
        },
        {
          x: [props.dot.x],
          y: [props.dot.y],
          name: "User",
          mode: "markers",
          type: "scatter",
          marker: {
            color: "red",
            size: 10,
          },
        },
      ];
    } else if (
      checked.show_surface === false &&
      checked.show_scatter === false
    ) {
      configData = [
        {
          x: [],
          y: [],
          mode: "lines",
        },
        {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
        },
        {
          x: [props.dot.x],
          y: [props.dot.y],
          name: "User",
          mode: "markers",
          type: "scatter",
          marker: {
            color: "red",
            size: 10,
          },
        },
      ];
    }

    setConfig(configData);
  }, [checked, plot_rows, surface_rows, props.inc, props.dot]);

  return (
    <Plot
      data={config}
      layout={{
        autosize: true,
        showlegend: false,
        hovermode: "closest",
        width: size * 0.37,
        height: size * 0.37,
        margin: {
          l: 60,
          r: 15,
          b: 35,
          t: 15,
        },
        xaxis: {
          title: `Altitude (km), Inclination=${props.inc} deg`,
          type: "linear",
          zeroline: false,
        },
        yaxis: {
          title: props.yAxisLabel,
          type: "linear",
          zeroline: false,
        },
      }}
      onHover={(e: any) => (e.event.target.style.cursor = "pointer")}
      onUnhover={(e: any) => (e.event.target.style.cursor = "crosshair")}
      onClick={(e) => props.onClick(e)}
      onDoubleClick={() => props.onClick()}
    />
  );
}

export default TwoViewSection;
