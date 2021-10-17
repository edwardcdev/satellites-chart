export interface MenuSubAttribute {
  id: number;
  dataset: string;
  name: string;
}

export interface MenuSelecter {
  [key: string]: Array<MenuSubAttribute>;
}

export interface DashParams {
  [key: string]: number;
}
