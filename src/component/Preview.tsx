/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateEffect } from 'ahooks';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from './utils';

const Preview = ({ md }: any) => {
  const id = generateUUID();

  useUpdateEffect(() => {
    const previewElement: any = document.getElementById(`preview-${id}`);
    Vditor.preview(previewElement, md);
  });

  return <div id={`preview-${id}`} className="preview" />;
};

export default Preview;
