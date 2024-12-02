import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { produce } from "immer";
import {
  Folder as FolderIcon,
  File as FileIcon,
  FilePlus as FilePlusIcon,
  FolderPlus as FolderPlusIcon,
} from "react-feather";

interface BaseNode {
  name: string;
  id: string;
  parentId: string | null;
}

interface File extends BaseNode {
  size: number;
  parentId: string;
  __type: "file";
}

interface Folder extends BaseNode {
  childrenIds: string[];
  parentId: string;
  __type: "folder";
}

const ROOT_ID = "<root>";

interface Root extends BaseNode {
  name: typeof ROOT_ID;
  childrenIds: string[];
  parentId: null;
  __type: "root";
}

type Node = File | Folder | Root;

interface FileSystem {
  nodes: Record<string, Node>;
}

const makeFile = (parentId: string): File =>
  ({
    id: nanoid(),
    parentId,
    name: faker.system.commonFileName(),
    size: Math.floor(Math.random() * 10_000_000 + 3_000),
    __type: "file",
  } satisfies File);

const makeFolder = (parentId: string): Folder =>
  ({
    id: nanoid(),
    parentId,
    name: faker.system.commonFileName().split(".")[0],
    childrenIds: [] as string[],
    __type: "folder",
  } satisfies Folder);

const makeRoot = (): Root =>
  ({
    id: ROOT_ID,
    parentId: null,
    name: ROOT_ID,
    childrenIds: [] as string[],
    __type: "root",
  } satisfies Root);

const makeFS = (): FileSystem => {
  const root = makeRoot();

  return {
    nodes: {
      [root.id]: root,
    },
  } satisfies FileSystem;
};

const formatSize = (size: number) => {
  if (size > 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} MB`;
  }
  return `${(size / 1_000).toFixed(2)} KB`;
};

const getSize = (fs: FileSystem, itemId: string): number => {
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

function NodePresentation({
  fs,
  id,
  onAddFile,
  onAddFolder,
}: {
  fs: FileSystem;
  id: string;
  onAddFile: (parentId: string) => void;
  onAddFolder: (parentId: string) => void;
}) {
  const item = fs.nodes[id];
  const size = useMemo(() => (item ? getSize(fs, id) : 0), [fs, item, id]);

  if (!item) {
    return null;
  }

  if (item.__type === "file") {
    return <FilePresentation file={item} />;
  }

  return (
    <FolderPresentation
      fs={fs}
      folder={item}
      size={size}
      onAddFile={onAddFile}
      onAddFolder={onAddFolder}
    />
  );
}

function FilePresentation({ file }: { file: File }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <FileIcon size={16} />
      <span>{file.name}</span>
      <em>{formatSize(file.size)}</em>
    </div>
  );
}

function FolderPresentation({
  fs,
  folder,
  size,
  onAddFile,
  onAddFolder,
}: {
  fs: FileSystem;
  folder: Folder | Root;
  size: number;
  onAddFile: (parentId: string) => void;
  onAddFolder: (parentId: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-row gap-2 items-center group">
        <FolderIcon size={16} />
        <strong>{folder.name}</strong>
        <em>{formatSize(size)}</em>
        <span className="hidden group-hover:flex gap-1">
          <button type="button" onClick={() => onAddFolder(folder.id)}>
            <FolderPlusIcon size={16} />
          </button>
          <button type="button" onClick={() => onAddFile(folder.id)}>
            <FilePlusIcon size={16} />
          </button>
        </span>
      </div>
      <div className="pl-4 border-l">
        {folder.childrenIds.map((id) => (
          <NodePresentation
            key={id}
            id={id}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            fs={fs}
          />
        ))}
      </div>
    </div>
  );
}

const addItem = (
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

function App() {
  const [fs, setFS] = useState(makeFS);

  const onAddFile = (parentId: string) => {
    setFS(addItem(fs, parentId, "file"));
  };

  const onAddFolder = (parentId: string) => {
    setFS(addItem(fs, parentId, "folder"));
  };

  return (
    <div className="p-4">
      <NodePresentation
        fs={fs}
        id={ROOT_ID}
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
      />
    </div>
  );
}

export default App;
