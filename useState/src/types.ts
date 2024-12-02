export interface BaseNode {
  name: string;
  id: string;
  parentId: string | null;
}

export interface File extends BaseNode {
  size: number;
  parentId: string;
  __type: "file";
}

export interface Folder extends BaseNode {
  childrenIds: string[];
  parentId: string;
  __type: "folder";
}

export const ROOT_ID = "<root>";

export interface Root extends BaseNode {
  name: typeof ROOT_ID;
  childrenIds: string[];
  parentId: null;
  __type: "root";
}

export type Node = File | Folder | Root;

export interface FileSystem {
  nodes: Record<string, Node>;
}
