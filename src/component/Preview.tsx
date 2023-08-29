/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from '../utils';

const Preview = ({ value }: { value: string }) => {
  const id = generateUUID();
  useLayoutEffect(() => {
    const VD = new Vditor(`preview-${id}`, {
      cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.9.4',
      cache: {
        enable: false,
      },
      toolbar: ['fullscreen', 'outline', 'preview'],
      resize: {
        enable: true,
      },
      minHeight: window.innerHeight * 0.7,
      value: value || '',
      outline: {
        enable: true,
        position: 'left',
      },
      after() {
        const evt = document.createEvent('Event');
        evt.initEvent('click', true, true);
        VD!.vditor!.toolbar!.elements!.preview!.firstElementChild!.dispatchEvent(evt);
      },
    });
  }, [value]);
  return <div id={`preview-${id}`} className="ndzy-preview" />;
};
export default Preview;
