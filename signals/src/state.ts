import { produce } from "immer";

import type { FileSystem, Folder, Root } from "./types";
import { makeFile, makeFolder } from "./factories";

export const addItem = (
  fs: FileSystem,
  parentId: string,
  type: "file" | "folder"
): FileSystem => {
  const parent = fs.nodes[parentId];
  if (!parent || parent.__type === "file") {
    throw new Error("Cannot add file as a child of another file");
  }
  return produce(fs, (draft) => {
    const newItem = type === "file" ? makeFile(parentId) : makeFolder(parentId);
    draft.nodes[newItem.id] = newItem;
    (draft.nodes[parentId] as Folder | Root).childrenIds.push(newItem.id);
  });
};

export const deleteItem = (fs: FileSystem, itemId: string): FileSystem => {
  const item = fs.nodes[itemId];
  if (!item) {
    throw new Error("Item not found");
  }
  if (item.__type === "root") {
    throw new Error("Cannot delete root");
  }
  const parentId = item.parentId;
  const parent = fs.nodes[parentId];
  if (!parent) {
    throw new Error("Item doesn't have parent");
  }
  if (parent.__type === "file") {
    throw new Error("Item's parent is invalid");
  }
  const i = parent.childrenIds.indexOf(itemId);
  if (i < 0) {
    throw new Error("Item is not marked as child of its parent");
  }

  return produce(fs, (draft) => {
    (draft.nodes[parentId] as Folder | Root).childrenIds.splice(i, 1);
    delete draft.nodes[itemId];
  });
};
