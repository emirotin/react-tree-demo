import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

import {
  type File,
  type Folder,
  type Root,
  type FileSystem,
  ROOT_ID,
} from "./types";

export const makeFile = (parentId: string): File =>
  ({
    id: nanoid(),
    parentId,
    name: faker.system.commonFileName(),
    size: Math.floor(Math.random() * 10_000_000 + 3_000),
    __type: "file",
  } satisfies File);

export const makeFolder = (parentId: string): Folder =>
  ({
    id: nanoid(),
    parentId,
    name: faker.system.commonFileName().split(".")[0],
    childrenIds: [] as string[],
    __type: "folder",
  } satisfies Folder);

export const makeRoot = (): Root =>
  ({
    id: ROOT_ID,
    parentId: null,
    name: ROOT_ID,
    childrenIds: [] as string[],
    __type: "root",
  } satisfies Root);

export const makeFS = (): FileSystem => {
  const root = makeRoot();

  return {
    nodes: {
      [root.id]: root,
    },
  } satisfies FileSystem;
};
