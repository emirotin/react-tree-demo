import type { FileSystem } from "./types";
import { makeFile, makeFolder } from "./factories";
import { batch } from "@preact/signals-core";

export const addItem = (
  fs: FileSystem,
  parentId: string,
  type: "file" | "folder"
) => {
  const parent = fs.$nodes.peek()[parentId];
  if (!parent || parent.__type === "file") {
    throw new Error("Cannot add file as a child of another file");
  }

  const newItem =
    type === "file" ? makeFile(parentId) : makeFolder(fs, parentId);

  batch(() => {
    fs.$nodes.value = {
      ...fs.$nodes.value,
      [newItem.id]: newItem,
    };

    parent.$childrenIds.value = [...parent.$childrenIds.value, newItem.id];
  });
};

export const deleteItem = (fs: FileSystem, itemId: string) => {
  const item = fs.$nodes.peek()[itemId];
  if (!item) {
    throw new Error("Item not found");
  }
  if (item.__type === "root") {
    throw new Error("Cannot delete root");
  }
  const parentId = item.parentId;
  const parent = fs.$nodes.peek()[parentId];
  if (!parent) {
    throw new Error("Item doesn't have parent");
  }
  if (parent.__type === "file") {
    throw new Error("Item's parent is invalid");
  }
  const i = parent.$childrenIds.peek().indexOf(itemId);
  if (i < 0) {
    throw new Error("Item is not marked as child of its parent");
  }

  batch(() => {
    parent.$childrenIds.value = parent.$childrenIds.value.filter(
      (id) => id !== itemId
    );

    const newNodes = { ...fs.$nodes.value };
    delete newNodes[itemId];
    fs.$nodes.value = newNodes;
  });
};
