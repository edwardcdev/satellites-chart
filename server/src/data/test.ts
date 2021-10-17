export const testData = {
  // x: [-180, -90, 90, 180],
  x: [-90, -30, 30, 90],
  y: [-90, -30, 30, 90],
  z: [
    [10, 10, 10, 10],
    [40, 40, 40, 40],
    [70, 70, 70, 70],
    [90, 90, 90, 90],
  ],
};

export const cartData = {
  coefficients: {
    availability: [0.001, 0.001, 0.001, 0.001],
    average_gap: [0.001, 0.001, 0.001, 0.001],
    coverage: [0.001, 0.001, 0.001, 0.001],
    data_volume:  [0.001, 0.001, 0.001, 0.001, 1],
    pointing_rate: [0.001, 0.001, 0.001, 0.001],
    reduced_coverage: [0.001, 0.001, 0.001, 0.001],
  },
  data: {
    label: "No Coverage (%)",
    plot_value: [
      { altitude: 300, inclination: 30, value: 50 },
      { altitude: 400, inclination: 30, value: 40 },
      { altitude: 500, inclination: 30, value: 30 },
    ],
    surface_value: [],
    type: "coverage",
  },
  text: "",
  maxAltitude: 1000
};
