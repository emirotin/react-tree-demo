import { useCallback, useMemo } from "react";

import { ROOT_ID } from "./types";
import { NodePresentation } from "./presentation";
import { addItem, deleteItem } from "./state";
import { makeFS } from "./factories";

function App() {
  const fs = useMemo(makeFS, []);

  const onAddFile = useCallback(
    (parentId: string) => {
      addItem(fs, parentId, "file");
    },
    [fs]
  );

  const onAddFolder = useCallback(
    (parentId: string) => {
      addItem(fs, parentId, "folder");
    },
    [fs]
  );

  const onDelete = useCallback(
    (itemId: string) => {
      deleteItem(fs, itemId);
    },
    [fs]
  );

  return (
    <div className="p-4">
      <NodePresentation
        fs={fs}
        item={fs.nodes[ROOT_ID]}
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        onDelete={onDelete}
      />
    </div>
  );
}

export default App;
