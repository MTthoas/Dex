export function formatBigNumber(reserve) {
  let number = Number(reserve);

  // Conversion en millions avec une précision décimale appropriée
  const million = 1000000;
  const formattedNumber = (number / million).toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return formattedNumber + "M";
}
