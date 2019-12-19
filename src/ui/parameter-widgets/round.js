

// https://www.jacklmoore.com/notes/rounding-in-javascript/
export default function round(value, decimals=6) {
  if (Math.abs(value) < Number('1e-6'))
    return 0
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}