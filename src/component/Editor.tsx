/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from './utils';
import { useResponsive } from '../hooks';

const Editor = ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  value?: { md: string; html: string };
  onChange?: (v: { md: string; html: string }) => void;
  placeholder?: string;
}) => {
  const id = generateUUID();
  const responsive = useResponsive();

  useLayoutEffect(() => {
    const vditor = new Vditor(`vditor-${id}`, {
      cache: {
        enable: false,
      },
      toolbar: responsive.large
        ? [
            'outline',
            '|',
            'headings',
            'bold',
            'italic',
            'strike',
            'quote',
            'line',
            'link',
            'table',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'code',
            'inline-code',
            '|',
            'insert-after',
            'insert-before',
            '|',
            'redo',
            'undo',
            'preview',
            'export',
            'fullscreen',
          ]
        : ['ordered-list', 'fullscreen'],
      input: (v) => {
        onChange && onChange({ md: v, html: vditor.getHTML() });
      },
      outline: {
        // 显示大纲
        enable: true,
        position: 'left',
      },
      minHeight: 200,
      placeholder,
      value: value?.md || '',
    });
  }, []);

  return <div id={`vditor-${id}`} className="ndzy-vditor" />;
};

export default Editor;
