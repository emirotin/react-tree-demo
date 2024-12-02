import { computed, signal } from "@preact/signals";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

import {
  type File,
  type Folder,
  type Root,
  type FileSystem,
  ROOT_ID,
} from "./types";

export const makeFile = (fs: FileSystem, parentId: string): File =>
  ({
    fs,
    id: nanoid(),
    parentId,
    name: faker.system.commonFileName(),
    $size: signal(Math.floor(Math.random() * 10_000_000 + 3_000)),
    __type: "file",
  } satisfies File);

export const makeFolder = (fs: FileSystem, parentId: string): Folder => {
  const selfId = nanoid();
  return {
    fs,
    id: selfId,
    parentId,
    name: faker.system.commonFileName().split(".")[0],
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
    $childrenIds: signal([] as string[]),
    __type: "folder",
  } satisfies Folder;
};

export const makeRoot = (fs: FileSystem): Root =>
  ({
    fs,
    id: ROOT_ID,
    parentId: null,
    name: ROOT_ID,
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
    $childrenIds: signal([] as string[]),
    __type: "root",
  } satisfies Root);

export const makeFS = (): FileSystem => {
  const fs: FileSystem = {
    $nodes: signal({}),
  };

  const root = makeRoot(fs);
  fs.$nodes.value = { [ROOT_ID]: root };

  return fs;
};
