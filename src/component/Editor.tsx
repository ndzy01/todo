/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from './utils';
import { useResponsive } from '../hooks';

const Editor = ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) => {
  const [, setVd] = useState<Vditor>();
  const id = generateUUID();
  const responsive = useResponsive();

  useEffect(() => {
    const vditor = new Vditor(`vditor-${id}`, {
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
        onChange && onChange(v);
      },
      minHeight: 180,
      placeholder,
      value: value || '',
      after: () => {
        setVd(vditor);
      },
    });
  }, []);

  return <div id={`vditor-${id}`} className="vditor" />;
};

export default Editor;
