import { computed, signal } from "@preact/signals-core";
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
    $size: signal(Math.random() * 10_000_000 + 3_000),
    __type: "file",
  } satisfies File);

export const makeFolder = (fs: FileSystem, parentId: string): Folder => {
  const selfId = nanoid();
  return {
    id: selfId,
    parentId,
    name: faker.system.commonFileName().split(".")[0],
    $childrenIds: signal<string[]>([]),
    __type: "folder",
    $size: computed(() => {
      const self = fs.$nodes.value[selfId] as Folder;

      return (
        4_000 +
        self.$childrenIds.value
          .map((id) => {
            const item = fs.$nodes.peek()[id];
            return item.$size.value;
          })
          .reduce((acc, x) => acc + x, 0)
      );
    }),
  } satisfies Folder;
};
export const makeRoot = (fs: FileSystem): Root =>
  ({
    id: ROOT_ID,
    parentId: null,
    name: ROOT_ID,
    $childrenIds: signal<string[]>([]),
    __type: "root",
    $size: computed(() => {
      const self = fs.$nodes.value[ROOT_ID] as Root;

      return (
        4_000 +
        self.$childrenIds.value
          .map((id) => {
            const item = fs.$nodes.peek()[id];
            return item.$size.value;
          })
          .reduce((acc, x) => acc + x, 0)
      );
    }),
  } satisfies Root);

export const makeFS = (): FileSystem => {
  const fs: FileSystem = {
    $nodes: signal({}),
  };

  const root = makeRoot(fs);
  fs.$nodes.value = { [ROOT_ID]: root };

  return fs;
};
