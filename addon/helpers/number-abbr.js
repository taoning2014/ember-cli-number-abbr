import { helper as buildHelper } from "@ember/component/helper";
import { A } from "@ember/array";

function log10(x) {
  if (Math.log10) {
    return Math.log10(x);
  } else {
    return Math.log(x) / Math.LN10;
  }
}

function getDecimalPlaces(adjustedNumber, maxSignificantPlaces) {
  const baseLength = Math.ceil(log10(adjustedNumber));
  const decimalPlaces =
    maxSignificantPlaces - (baseLength > 0 ? baseLength : 0);
  return decimalPlaces > 0 ? decimalPlaces : 0;
}

export function numberAbbr([
  number = 0,
  delimiter = ".",
  maxSignificantPlaces = 3,
  padding = false,
  abbreviations = null
]) {
  number = parseInt(number);

  let symbols =
    abbreviations ||
    A([
      "",
      "K",
      "M",
      "B",
      "T",
      "Qua",
      "Qui",
      "Sex",
      "Sep",
      "Oct",
      "Non",
      "Dec"
    ]);

  let results = symbols.map((symbol, index) => {
    const adjustedNumber = number / Math.pow(10, index * 3);

    const decimalPlaces = getDecimalPlaces(
      adjustedNumber,
      maxSignificantPlaces
    );
    const roundedNumber = adjustedNumber.toFixed(decimalPlaces);

    let strippedNumber = padding
      ? roundedNumber
      : roundedNumber.replace(/(\.0+$)/, "");
    strippedNumber = strippedNumber.replace(/\./, delimiter);
    return strippedNumber + symbol;
  });

  const result = A(results).find((result, index) => {
    return number.toString().length <= (index + 1) * 3;
  });

  return result;
}

export default buildHelper(numberAbbr);
