import React from 'react';
import Plot from 'react-plotly.js';

const LineChart: React.FC<any> = (props: any) => {
  return (
    <Plot
      data={[
        {
          x: props.source.xTraces,
          y: props.source.yTraces,
          name: 'Gap Event Duration',
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' }
        },
        {
          x: props.source.xTraces,
          y: props.source.avgTraces,
          name: 'Running Average',
          type: 'scatter',
          marker: { color: 'blue' }
        }
      ]}
      layout={{
        title: {
          text: `<b>${props.source.title}</b>`,
          font: {
            family: 'Roboto',
            size: 15
          }
        },
        width: props.isSubChart
          ? Number(props.size.width.replace('px', '')) * 0.52
          : Number(props.size.width.replace('px', '')) * 0.38,
        height: props.isSubChart
          ? Number(props.size.width.replace('px', '')) * 0.33
          : Number(props.size.height.replace('px', '')) * 0.3,
        showlegend: true,
        legend: {
          orientation: 'h',
          xanchor: 'center',
          font: {
            family: 'sans-serif',
            size: 12,
            color: '#000'
          }
        },
        margin: {
          l: 60,
          b: 0,
          r: 30,
          t: 30,
          pad: 5
        },
        xaxis: {
          title:
            props.dataType === 'coverage' ? 'Coverage Event Number' : 'Gap Event Number',
          titlefont: {
            size: 12,
            color: '#212529'
          },
          showgrid: true,
          zerolinecolor: '#969696',
          zerolinewidth: 1
        },
        yaxis: {
          title:
            props.dataType === 'coverage'
              ? 'Coverage Duration (Sec.)'
              : 'Gap Duration (Sec.)',
          titlefont: {
            size: 12,
            color: '#212529'
          },
          showgrid: true,
          zerolinecolor: '#969696',
          zerolinewidth: 1
        }
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default LineChart;
