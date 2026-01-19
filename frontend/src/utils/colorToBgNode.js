export const colorToBgNode = (hex, opacity = 0.4) => {
  if (!hex || typeof hex !== "string") {
    return `rgba(50, 60, 76, ${opacity})`;
  }
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
