/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from '../utils';

const Preview = ({ value }: { value: string }) => {
  const id = generateUUID();
  useLayoutEffect(() => {
    Vditor.preview(document.getElementById(`preview-${id}`) as any, value, {
      cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.9.4',
      mode: 'light',
    });
  }, [value]);
  return <div id={`preview-${id}`} className="ndzy-preview" />;
};
export default Preview;
