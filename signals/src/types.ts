import type { ReadonlySignal, Signal } from "@preact/signals";

export interface BaseNode {
  fs: FileSystem;
  name: string;
  id: string;
  parentId: string | null;
  $size: ReadonlySignal<number>;
}

export interface File extends BaseNode {
  parentId: string;
  __type: "file";
}

export interface Folder extends BaseNode {
  $childrenIds: Signal<string[]>;
  parentId: string;
  __type: "folder";
}

export const ROOT_ID = "<root>";

export interface Root extends BaseNode {
  name: typeof ROOT_ID;
  $childrenIds: Signal<string[]>;
  parentId: null;
  __type: "root";
}

export type Node = File | Folder | Root;

export interface FileSystem {
  $nodes: Signal<Record<string, Node>>;
}
