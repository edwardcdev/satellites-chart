import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Grid, Button, Box } from "@material-ui/core";

import { getPlotItems } from "../../../API";

const INIT_SOURCE = {
  heatmap: {},
  intrpl: {},
};

function TerrestrialHeatMap() {
  const [mode, setMode] = useState("heatmap");
  const [source, setSource] = useState(INIT_SOURCE as any);

  useEffect(() => {
    getPlotItems()
      .then((res: any) => {
        setSource(res.data);
      })
      .catch(() => setSource(INIT_SOURCE));
  }, []);
  return (
    <>
      <Grid container justify="center" alignItems="center">
        {mode === "heatmap" ? (
          <>
            <Grid item md={6}>
              <Plot
                data={[
                  {
                    x: source.heatmap.x,
                    y: source.heatmap.y,
                    z: source.heatmap.z,
                    type: "heatmap",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: "",
                  xaxis: {
                    title: "Longitude (deg)",
                    zeroline: false,
                    range: [-180, 180],
                    tickmode: "linear",
                    tick0: -180,
                    dtick: 40,
                  },
                  yaxis: {
                    title: "Latitude (deg)",
                    zeroline: false,
                    range: [-90, 90],
                    tickmode: "linear",
                    tick0: -90,
                    dtick: 30,
                  },
                }}
              />
            </Grid>
            <Grid item md={6}>
              <Plot
                data={[
                  {
                    lat: source.heatmap.x,
                    lon: source.heatmap.y,
                    z: source.heatmap.z,
                    type: "densitymapbox",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: "",
                  mapbox: {
                    center: { lon: 60, lat: 30 },
                    style: "outdoors",
                    zoom: 2,
                  },
                }}
                config={{
                  mapboxAccessToken:
                    "pk.eyJ1IjoicmxhZm9udGFpbmUiLCJhIjoiY2tpMG82ZjNiMHZ3NjJxcDV1cjAzaTJ4eCJ9.VJSnQNJxiJK-jixU6KaFYQ",
                }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item md={6}>
              <Plot
                data={[
                  {
                    x: source.intrpl.x,
                    y: source.intrpl.y,
                    z: source.intrpl.z,
                    type: "heatmap",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: "",
                  xaxis: {
                    title: "Longitude (deg)",
                    zeroline: false,
                    range: [-180, 180],
                    tickmode: "linear",
                    tick0: -180,
                    dtick: 40,
                  },
                  yaxis: {
                    title: "Latitude (deg)",
                    zeroline: false,
                    range: [-90, 90],
                    tickmode: "linear",
                    tick0: -90,
                    dtick: 30,
                  },
                }}
              />
            </Grid>
            <Grid item md={6}>
              <Plot
                data={[
                  {
                    lat: source.intrpl.x,
                    lon: source.intrpl.x,
                    z: source.intrpl.z,
                    type: "densitymapbox",
                    hoverinfo: "skip",
                  },
                ]}
                layout={{
                  width: 500,
                  height: 500,
                  title: "",
                  mapbox: {
                    center: { lon: 60, lat: 30 },
                    style: "outdoors",
                    zoom: 2,
                  },
                }}
                config={{
                  mapboxAccessToken:
                    "pk.eyJ1IjoicmxhZm9udGFpbmUiLCJhIjoiY2tpMG82ZjNiMHZ3NjJxcDV1cjAzaTJ4eCJ9.VJSnQNJxiJK-jixU6KaFYQ",
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid item md={6}>
        <Box
          borderColor="primary.main"
          border={2}
          borderRadius={5}
          padding={2}
          style={{ zIndex: 1000 }}
        >
          <Button
            name="heatmap"
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => setMode(e.currentTarget.name)}
            style={{ width: "48%", marginRight: "4%" }}
          >
            {"Non-Interpolated"}
          </Button>
          <Button
            name="intrpl"
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => setMode(e.currentTarget.name)}
            style={{ width: "48%" }}
          >
            {"Interpolated"}
          </Button>
        </Box>
      </Grid>
    </>
  );
}

export default TerrestrialHeatMap;
