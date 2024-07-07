const generateIncrementalArray = (
  startingNumber: number,
  count: number
): number[] => {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(startingNumber + i);
  }
  return result;
};
