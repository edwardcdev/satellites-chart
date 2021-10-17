import { MenuSelecter, DashParams } from 'src/types/constatnts';

export const BASE_URL = 'http://127.0.0.1:7000';
// export const BASE_URL = 'http://20.80.240.57';

export const MENU_ITEMS: MenuSelecter = {
  as_needed_handoff: [
    { id: 0, dataset: 'coverage', name: 'Key Metrics' },
    { id: 1, dataset: 'coverage', name: 'Running Average' },
    { id: 2, dataset: 'coverage_histogram', name: 'Distribution' },
    { id: 3, dataset: 'coverage_histogram', name: 'Statistics Chart' }
  ],
  maximum_powee_handoff: [
    { id: 0, dataset: 'gap', name: 'Key Metrics' },
    { id: 1, dataset: 'gap', name: 'Running Average' },
    { id: 2, dataset: 'gap_histogram', name: 'Distribution' },
    { id: 3, dataset: 'gap_histogram', name: 'Statistics Chart' }
  ]
};

export const INIT_PARAMS: DashParams = {
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
  value: 100
};
