export function formatFilename(filename: string): string {
  // Decode URL encoding (e.g., %20 to space)
  const decodedName = decodeURIComponent(filename);

  // Capitalize each word and remove extra spaces
  const formattedName = decodedName
    .split(/\s+/) // Split by whitespace
    .join(" ");

  return formattedName.trim(); // Trim any extra spaces
}
