import { useSignals } from "@preact/signals-react/runtime";
import {
  Folder as FolderIcon,
  File as FileIcon,
  FilePlus as FilePlusIcon,
  FolderPlus as FolderPlusIcon,
  Trash as TrashIcon,
} from "react-feather";

import type { File, Folder, Root, FileSystem } from "./types";
import { formatSize } from "./size";

export function NodePresentation({
  fs,
  id,
  onAddFile,
  onAddFolder,
  onDelete,
}: {
  fs: FileSystem;
  id: string;
  onAddFile: (parentId: string) => void;
  onAddFolder: (parentId: string) => void;
  onDelete: (itemId: string) => void;
}) {
  useSignals();

  const item = fs.$nodes.value[id];

  if (!item) {
    return null;
  }

  if (item.__type === "file") {
    return <FilePresentation file={item} onDelete={onDelete} />;
  }

  return (
    <FolderPresentation
      fs={fs}
      folder={item}
      onAddFile={onAddFile}
      onAddFolder={onAddFolder}
      onDelete={onDelete}
    />
  );
}

function FilePresentation({
  file,
  onDelete,
}: {
  file: File;
  onDelete: (itemId: string) => void;
}) {
  useSignals();

  return (
    <div className="flex flex-row gap-2 items-center group">
      <FileIcon size={16} />
      <span>{file.name}</span>
      <em>{formatSize(file.$size.value)}</em>
      <span className="hidden group-hover:flex gap-1">
        <button type="button" onClick={() => onDelete(file.id)}>
          <TrashIcon size={16} />
        </button>
      </span>
    </div>
  );
}

function FolderPresentation({
  fs,
  folder,
  onAddFile,
  onAddFolder,
  onDelete,
}: {
  fs: FileSystem;
  folder: Folder | Root;
  onAddFile: (parentId: string) => void;
  onAddFolder: (parentId: string) => void;
  onDelete: (itemId: string) => void;
}) {
  useSignals();

  return (
    <div>
      <div className="flex flex-row gap-2 items-center group">
        <FolderIcon size={16} />
        <strong>{folder.name}</strong>
        <em>{formatSize(folder.$size.value)}</em>
        <span className="hidden group-hover:flex gap-1">
          <button type="button" onClick={() => onAddFolder(folder.id)}>
            <FolderPlusIcon size={16} />
          </button>
          <button type="button" onClick={() => onAddFile(folder.id)}>
            <FilePlusIcon size={16} />
          </button>
          {folder.__type !== "root" && (
            <button type="button" onClick={() => onDelete(folder.id)}>
              <TrashIcon size={16} />
            </button>
          )}
        </span>
      </div>
      <div className="pl-4 border-l">
        {folder.$childrenIds.value.map((id) => (
          <NodePresentation
            key={id}
            id={id}
            fs={fs}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
