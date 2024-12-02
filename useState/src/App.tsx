import { faker } from "@faker-js/faker";
import { Fragment, useMemo, useState } from "react";
import {
  Folder as FolderIcon,
  File as FileIcon,
  FilePlus as FilePlusIcon,
} from "react-feather";

interface File {
  name: string;
  size: number;
  parent: Folder | FileSystem;
  __type: "file";
}

interface Folder {
  name: string;
  children: Array<File | Folder>;
  parent: Folder | FileSystem;
  __type: "folder";
}

interface FileSystem extends Omit<Folder, "__type" | "parent"> {
  name: "<root>";
  parent: null;
  __type: "root";
}

const makeFile = (parent: Folder | FileSystem) =>
  ({
    name: faker.system.commonFileName(),
    size: Math.floor(Math.random() * 10_000_000 + 3_000),
    parent,
    __type: "file",
  } satisfies File);

const makeFolder = (parent: Folder | FileSystem) =>
  ({
    name: faker.system.commonFileName().split(".")[0],
    children: [] as Array<File | Folder>,
    parent,
    __type: "folder",
  } satisfies Folder);

const makeFS = () =>
  ({
    name: "<root>",
    children: [] as Array<File | Folder>,
    parent: null,
    __type: "root",
  } satisfies FileSystem);

const generateFS = () => {
  const fs = makeFS();
  for (let i = 0; i < 6; i++) {
    const f = makeFolder(fs);
    fs.children.push(f);
    for (let j = 0; j < 5; j++) {
      const f1 = makeFolder(f);
      f.children.push(f1);
      for (let j = 0; j < 5; j++) {
        f1.children.push(makeFile(f1));
      }
    }
    for (let j = 0; j < 5; j++) {
      f.children.push(makeFile(f));
    }
  }
  return fs;
};

const formatSize = (size: number) => {
  if (size > 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} MB`;
  }
  return `${(size / 1_000).toFixed(2)} KB`;
};

const getSize = (item: File | Folder | FileSystem): number => {
  if (item.__type === "file") {
    return item.size;
  }
  return 4_000 + item.children.map(getSize).reduce((acc, x) => acc + x, 0);
};

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
  folder,
  onAddFile,
}: {
  folder: Folder | FileSystem;
  onAddFile: (folder: Folder | FileSystem) => void;
}) {
  const size = useMemo(() => getSize(folder), [folder]);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center group">
        <FolderIcon size={16} />
        <strong>{folder.name}</strong>
        <em>{formatSize(size)}</em>
        <span className="hidden group-hover:inline-block">
          <button type="button" onClick={() => onAddFile(folder)}>
            <FilePlusIcon size={16} />
          </button>
        </span>
      </div>
      <div className="pl-4 border-l">
        {folder.children.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Fragment key={i}>
            {item.__type === "file" ? (
              <FilePresentation file={item} />
            ) : (
              <FolderPresentation folder={item} onAddFile={onAddFile} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const replaceChild = <T extends Folder | FileSystem>(
  parent: T,
  item: Folder
) => {
  return {
    ...parent,
    children: parent.children.map((c) => (c.name === item.name ? item : c)),
  } as T;
};

const addFile = (parent: Folder | FileSystem): FileSystem => {
  const newParent = {
    ...parent,
    children: [...parent.children, makeFile(parent)],
  } as Folder | FileSystem;
  if (newParent.__type === "root") {
    return newParent;
  }
  let result: Folder | FileSystem = newParent;
  while (result.parent !== null) {
    result = replaceChild(result.parent, result);
  }
  return result;
};

function App() {
  const [fs, setFS] = useState(generateFS);

  const onAddFile = (folder: Folder | FileSystem) => {
    setFS(addFile(folder));
  };

  return (
    <div className="p-4">
      <FolderPresentation folder={fs} onAddFile={onAddFile} />
    </div>
  );
}

export default App;
