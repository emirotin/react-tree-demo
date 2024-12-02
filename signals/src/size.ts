import type { FileSystem } from "./types";

export const formatSize = (size: number) => {
  if (size > 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} MB`;
  }
  return `${(size / 1_000).toFixed(2)} KB`;
};

export const getSize = (fs: FileSystem, itemId: string): number => {
  const item = fs.nodes[itemId];
  if (!item) {
    return 0;
  }

  if (item.__type === "file") {
    return item.size;
  }
  return (
    4_000 +
    item.childrenIds.map((id) => getSize(fs, id)).reduce((acc, x) => acc + x, 0)
  );
};
