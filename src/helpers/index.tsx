export function round(num: number) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export function findSlope(
  firstX: number,
  firstY: number,
  currX: number,
  currY: number
): number {
  try {
    return (firstY - currY) / (firstX - currX);
  } catch {
    return (firstY - currY) / (firstX - currX + 0.00001);
  }
};
