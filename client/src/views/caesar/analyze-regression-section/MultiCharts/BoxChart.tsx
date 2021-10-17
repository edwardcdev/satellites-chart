import React from 'react';
import Plot from 'react-plotly.js';

const BoxChart: React.FC<any> = (props: any) => {
  return (
    <Plot
      data={[
        {
          y: props.source.xTraces,
          boxpoints: 'all',
          name: '',
          type: 'box'
        }
      ]}
      layout={{
        title: {
          text: `<b>${props.source.title.split(' ')[0]} Statistics</b>`,
          font: {
            family: 'Roboto',
            size: 15
          }
        },
        width: props.isSubChart
          ? Number(props.size.width.replace('px', '')) * 0.56
          : Number(props.size.width.replace('px', '')) * 0.38,
        height: props.isSubChart
          ? Number(props.size.width.replace('px', '')) * 0.33
          : Number(props.size.height.replace('px', '')) * 0.3,
        margin: {
          l: 60,
          b: 0,
          r: 30,
          t: 30,
          pad: 5
        },
        yaxis: {
          title: 'Duration',
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

export default BoxChart;
