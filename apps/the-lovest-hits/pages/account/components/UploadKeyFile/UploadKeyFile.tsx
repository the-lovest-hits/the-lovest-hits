import { CubeEntity } from "../../add";

function UploadKeyFile({className, setActiveCube}) {
  return (
    <div className={className} onClick={() => setActiveCube(CubeEntity.UploadKeyFile)}>
      <div className="account-add-cube__content">
        <p>UploadKeyFile</p>

        <p>DragnDrop place</p>
      </div>
    </div>
  );
}

export default UploadKeyFile;
