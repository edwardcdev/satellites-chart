export const getAvgs = (data: number[]) => {
  let sum: number = 0;
  let res: Array<[number, number]> = data.map((item: number, idx: number) => {
    sum += item;
    return [item, sum / (idx + 1)];
  });

  return res;
};
