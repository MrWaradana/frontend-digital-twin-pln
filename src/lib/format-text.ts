export function formatFilename(filename: string): string {
  // Decode URL encoding (e.g., %20 to space)
  const decodedName = decodeURIComponent(filename);

  // Capitalize each word and remove extra spaces
  const formattedName = decodedName
    .split(/\s+/) // Split by whitespace
    .join(" ");

  return formattedName.trim(); // Trim any extra spaces
}

export const formatUnderscoreToSpace = (text: string): string => {
  if (!text) return "";
  return text.replace(/_/g, " ");
};

export function formatTextToUrl(encodedText: string): string {
  // First decode the URL-encoded string
  const decodedText = decodeURIComponent(encodedText);

  // Convert to title case and remove extra spaces
  return (
    decodedText
      .toLowerCase()
      .split(" ")
      // .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .map((word) => word.toUpperCase())
      .join("-")
      .trim()
  );
}

export function formatUrlText(encodedText: string): string {
  // First decode the URL-encoded string
  const decodedText = decodeURIComponent(encodedText);

  // Convert to title case and remove extra spaces
  return (
    decodedText
      .toLowerCase()
      .split("-")
      // .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .map((word) => word.toUpperCase())
      .join(" ")
      .trim()
  );
}
