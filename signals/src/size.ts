export const formatSize = (size: number) => {
  if (size > 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} MB`;
  }
  return `${(size / 1_000).toFixed(2)} KB`;
};
