import { useState } from "react";

import { ROOT_ID } from "./types";
import { NodePresentation } from "./presentation";
import { addItem, deleteItem } from "./state";
import { makeFS } from "./factories";

function App() {
  const [fs, setFS] = useState(makeFS);

  const onAddFile = (parentId: string) => {
    setFS(addItem(fs, parentId, "file"));
  };

  const onAddFolder = (parentId: string) => {
    setFS(addItem(fs, parentId, "folder"));
  };

  const onDelete = (itemId: string) => {
    setFS(deleteItem(fs, itemId));
  };

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
