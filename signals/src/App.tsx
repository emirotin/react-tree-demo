import { ROOT_ID } from "./types";
import { NodePresentation } from "./presentation";
import { addItem, deleteItem } from "./state";
import { makeFS } from "./factories";
import { useCallback, useRef } from "react";

function App() {
  const fs = useRef(makeFS());

  const onAddFile = useCallback((parentId: string) => {
    addItem(fs.current, parentId, "file");
  }, []);

  const onAddFolder = useCallback((parentId: string) => {
    addItem(fs.current, parentId, "folder");
  }, []);

  const onDelete = useCallback((itemId: string) => {
    deleteItem(fs.current, itemId);
  }, []);

  return (
    <div className="p-4">
      <NodePresentation
        item={fs.current.$nodes.peek()[ROOT_ID]}
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        onDelete={onDelete}
      />
    </div>
  );
}

export default App;
