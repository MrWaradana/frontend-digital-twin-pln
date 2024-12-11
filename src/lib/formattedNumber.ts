export const formattedNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

export const formatCurrency = (number: any) => {
  // Handle zero case
  if (number === 0) {
    return "Rp0";
  }

  // Convert to absolute value to handle negative numbers
  const absNumber = Math.abs(number);
  const sign = number < 0 ? "-" : "";

  // If the number is very small (more than 2 decimal places of zeros)
  if (absNumber > 0 && absNumber < 0.01) {
    // Convert to scientific notation
    const scientificStr = number.toExponential();
    // Format to match desired pattern (e.g., -7.6x10^-8)
    const [coefficient, exponent] = scientificStr.split("e");
    return `${Number(coefficient).toFixed(1)}x10^${exponent}`;
  }

  // Regular formatting for normal numbers
  const inMillions = (absNumber / 1_000_000).toFixed(2);
  return sign + new Intl.NumberFormat("id-ID").format(Number(inMillions));
};

export const formatSplitNumber = (num: number | string) => {
  // If the input is not a valid number, return empty string or "0"
  if (num === "" || isNaN(Number(num))) {
    return "0";
  }

  // Convert the input number to a string to avoid rounding off decimals
  const parts = num.toString().split(".");
  const integerPart = new Intl.NumberFormat("id-ID").format(Number(parts[0]));

  // Return the formatted number with a decimal part if present
  return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
};

export const unformatNumber = (formattedValue: string) => {
  // Remove thousands separators (commas) and replace decimal commas with periods
  return formattedValue.replace(/\./g, "").replace(",", ".");
};
