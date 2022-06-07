import {
  useCallback,
  useState
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CubeEntity } from "../../add";
import { TargetBox } from "../../../../components/DND";
import { FileList } from "../../../../components/DND";

function UploadKeyFile({className, setActiveCube, active, children, title}) {

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
      <div className="plan plan--green">

        <h3 className="plan__title">{ title }</h3>

        <span className="plan__price"><span>Uploader generated yearly KeyFile.json</span></span>

        {!active ? children : (
          <DndProvider backend={HTML5Backend}>
            <TargetBox onDrop={handleFileDrop}>
              <FileList files={droppedFiles} />
            </TargetBox>
          </DndProvider>
        )}

      </div>
    </div>
  );
}

export default UploadKeyFile;
