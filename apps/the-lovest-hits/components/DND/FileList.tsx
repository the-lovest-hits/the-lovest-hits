import type { FC } from 'react'
import { useMemo } from 'react'

export interface FileListProps {
  files: File[];
}

function list(files: File[]) {
  const label = (file: File) => `'${file.name}' of size '${file.size}' and type '${file.type}'`;

  return files.map((file) => <li key={file.name}>{label(file)}</li>);
}

export const FileList: FC<FileListProps> = ({ files }) => {
  if (files.length === 0) {
    return <div className={'no-files'}></div>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fileList = useMemo(() => list(files), [files]);

  return <div className={'file-list'}>{fileList}</div>;
}
