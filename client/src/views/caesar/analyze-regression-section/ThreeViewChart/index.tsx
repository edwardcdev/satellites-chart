import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const ThreeViewSection: React.FC<any> = (props: any) => {
  const [config, setConfig] = useState([]);

  const unpack = (rows: Array<any>, key: any) => {
    return rows.map(function (row) {
      return row[key];
    });
  };

  useEffect(() => {
    let configData: any = [];
    if (props.checked.show_surface === true && props.checked.show_scatter === true) {
      configData = [
        {
          x: unpack(props.plot_rows, 'altitude'),
          y: unpack(props.plot_rows, 'inclination'),
          z: unpack(props.plot_rows, 'value'),
          name: 'Model data',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'rgb(23, 190, 207)',
            size: 2
          }
        },
        {
          x: unpack(props.surface_rows, 'altitude'),
          y: unpack(props.surface_rows, 'inclination'),
          z: unpack(props.surface_rows, 'value'),
          name: 'Model surface',
          opacity: 0.3,
          type: 'mesh3d',
          color: 'rgb(252, 154, 7)'
        },
        {
          x: [props.alt],
          y: [props.inc],
          z: [props.value],
          name: 'User',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'red',
            size: 5
          }
        }
      ];
    } else if (
      props.checked.show_surface === false &&
      props.checked.show_scatter === true
    ) {
      configData = [
        {
          x: unpack(props.plot_rows, 'altitude'),
          y: unpack(props.plot_rows, 'inclination'),
          z: unpack(props.plot_rows, 'value'),
          name: 'Model data',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'rgb(23, 190, 207)',
            size: 2
          }
        },
        {
          x: [props.alt],
          y: [props.inc],
          z: [props.value],
          name: 'User',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'red',
            size: 5
          }
        }
      ];
    } else if (
      props.checked.show_surface === true &&
      props.checked.show_scatter === false
    ) {
      configData = [
        {
          x: unpack(props.surface_rows, 'altitude'),
          y: unpack(props.surface_rows, 'inclination'),
          z: unpack(props.surface_rows, 'value'),
          name: 'Model surface',
          opacity: 0.3,
          type: 'mesh3d',
          color: 'rgb(252, 154, 7)'
        },
        {
          x: [props.alt],
          y: [props.inc],
          z: [props.value],
          name: 'User',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'red',
            size: 5
          }
        }
      ];
    } else if (
      props.checked.show_surface === false &&
      props.checked.show_scatter === false
    ) {
      configData = [
        {
          x: [],
          y: [],
          z: [],
          type: 'mesh3d'
        },
        {
          x: [],
          y: [],
          z: [],
          mode: 'markers',
          type: 'scatter3d'
        },
        {
          x: [parseFloat(props.alt)],
          y: [parseFloat(props.inc)],
          z: [parseFloat(props.value)],
          name: 'User',
          mode: 'markers',
          type: 'scatter3d',
          opacity: 1,
          marker: {
            color: 'red',
            size: 5
          }
        }
      ];
    }

    setConfig(configData);
  }, [
    props.checked,
    props.plot_rows,
    props.surface_rows,
    props.reset,
    props.alt,
    props.inc,
    props.value
  ]);

  return (
    <Plot
      data={config}
      layout={{
        autosize: true,
        width: props.isChart
          ? Number(props.size.width.replace('px', '')) * 0.55
          : Number(props.size.width.replace('px', '')) * 0.4,
        height: props.isChart
          ? Number(props.size.height.replace('px', '')) * 0.4
          : Number(props.size.height.replace('px', '')) * 0.3,
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0
        },
        scene: {
          aspectratio: {
            x: 0.6,
            y: 0.6,
            z: 0.6
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0
            },
            eye: {
              x: 0.9,
              y: 0.9,
              z: 0.9
            },
            up: {
              x: 0,
              y: 0,
              z: 1
            }
          },
          xaxis: {
            title: 'Altitude (km)',
            type: 'linear',
            range: [Math.max(...unpack(props.surface_rows, 'altitude')), 0],
            zeroline: false
          },
          yaxis: {
            title: 'Inclination (deg)',
            type: 'linear',
            range: [90, 0],
            zeroline: false
          },
          zaxis: {
            title: props.zAxisLabel,
            type: 'linear',
            range: [
              Math.min(...unpack(props.surface_rows, 'value')),
              Math.max(...unpack(props.surface_rows, 'value'))
            ],
            zeroline: false
          }
        },
        showlegend: false
      }}
      onClick={(e) => props.onClick(e)}
      onDoubleClick={() => props.onClick()}
    />
  );
};

export default ThreeViewSection;
