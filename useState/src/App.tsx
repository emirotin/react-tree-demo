import { useCallback, useState } from "react";

import { ROOT_ID } from "./types";
import { NodePresentation } from "./presentation";
import { addItem, deleteItem } from "./state";
import { makeFS } from "./factories";

function App() {
  const [fs, setFS] = useState(makeFS);

  const onAddFile = useCallback(
    (parentId: string) => {
      setFS(addItem(fs, parentId, "file"));
    },
    [fs]
  );

  const onAddFolder = useCallback(
    (parentId: string) => {
      setFS(addItem(fs, parentId, "folder"));
    },
    [fs]
  );

  const onDelete = useCallback(
    (itemId: string) => {
      setFS(deleteItem(fs, itemId));
    },
    [fs]
  );

  return (
    <div className="p-4">
      <NodePresentation
        fs={fs}
        id={ROOT_ID}
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        onDelete={onDelete}
      />
    </div>
  );
}

export default App;
