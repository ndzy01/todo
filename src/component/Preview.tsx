import { useUpdateEffect } from 'ahooks';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from './utils';

const Preview = ({ md }: { md: string }) => {
  const id = generateUUID();

  useUpdateEffect(() => {
    const previewElement = document.getElementById(`preview-${id}`);

    Vditor.preview(previewElement as HTMLDivElement, md);
  });

  return <div id={`preview-${id}`} className="preview" />;
};

export default Preview;
