/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from './utils';

const Preview = ({ value }: { value: string }) => {
  const id = generateUUID();

  useLayoutEffect(() => {
    const VD = new Vditor(`preview-${id}`, {
      cache: {
        enable: false,
      },
      toolbar: ['fullscreen', 'outline', 'preview'],
      resize: {
        enable: true,
      },
      minHeight: 200,
      value: value || '',
      outline: {
        // 显示大纲
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
