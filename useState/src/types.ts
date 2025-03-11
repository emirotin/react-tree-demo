export interface BaseNode {
  name: string;
  id: string;
  parentId: string | null;
}

export interface File extends BaseNode {
  size: number;
  parentId: string;
  __type: "file"; // Branded types
}

export interface Folder extends BaseNode {
  childrenIds: string[];
  parentId: string;
  __type: "folder"; // Branded types
}

export const ROOT_ID = "<root>";

export interface Root extends BaseNode {
  id: typeof ROOT_ID;
  name: typeof ROOT_ID;
  childrenIds: string[];
  parentId: null;
  __type: "root"; // Branded types
}

export type Node = File | Folder | Root;

export interface FileSystem {
  nodes: Record<string, Node>;
}
