import {
  useCallback,
  useState
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CubeEntity } from "../../add";
import { TargetBox } from "../../../../components/DND";
import { FileList } from "../../../../components/DND";

function UploadKeyFile({className, setActiveCube}) {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleFileDrop = useCallback(
    (item: { files: any[] }) => {
      if (item) {
        const files = item.files;

        setDroppedFiles(files);
      }
    },
    [setDroppedFiles],
  )

  return (
    <div className={className} onClick={() => setActiveCube(CubeEntity.UploadKeyFile)}>
      <div className="account-add-cube__content">
        <DndProvider backend={HTML5Backend}>
          <TargetBox onDrop={handleFileDrop}>
            <FileList files={droppedFiles} />
          </TargetBox>
        </DndProvider>
      </div>
    </div>
  );
}

export default UploadKeyFile;
