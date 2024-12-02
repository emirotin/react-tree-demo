import { faker } from "@faker-js/faker";
import { Fragment, useEffect, useState } from "react";
import { Folder as FolderIcon, File as FileIcon } from "react-feather";

interface File {
  name: string;
  size: number;
  __type: "file";
}

interface Folder {
  name: string;
  children: Array<File | Folder>;
  __type: "folder";
}

interface FileSystem extends Omit<Folder, "__type"> {
  name: "<root>";
  __type: "root";
}

const makeFile = () =>
  ({
    name: faker.system.commonFileName(),
    size: Math.floor(Math.random() * 1_000_000 + 3_000),
    __type: "file",
  } satisfies File);

const makeFolder = () =>
  ({
    name: faker.system.commonFileName().split(".")[0],
    children: [] as Array<File | Folder>,
    __type: "folder",
  } satisfies Folder);

const makeFS = () =>
  ({
    name: "<root>",
    children: [] as Array<File | Folder>,
    __type: "root",
  } satisfies FileSystem);

const generateFS = () => {
  const fs = makeFS();
  for (let i = 0; i < 6; i++) {
    const f = makeFolder();
    fs.children.push(f);
    for (let j = 0; j < 5; j++) {
      const f1 = makeFolder();
      f.children.push(f1);
      for (let j = 0; j < 5; j++) {
        f1.children.push(makeFile());
      }
    }
    for (let j = 0; j < 5; j++) {
      f.children.push(makeFile());
    }
  }
  return fs;
};

function FilePresentation({ file }: { file: File }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <FileIcon size={16} />
      <span>{file.name}</span>
    </div>
  );
}

function FolderPresentation({ folder }: { folder: Folder | FileSystem }) {
  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <FolderIcon size={16} />
        <strong>{folder.name}</strong>
      </div>
      <div className="pl-2">
        {folder.children.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Fragment key={i}>
            {item.__type === "file" ? (
              <FilePresentation file={item} />
            ) : (
              <FolderPresentation folder={item} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [fs, setFS] = useState(generateFS);

  return (
    <div className="p-4">
      <FolderPresentation folder={fs} />
    </div>
  );
}

export default App;
