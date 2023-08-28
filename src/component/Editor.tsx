/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { generateUUID } from '../utils';
import { useResponsive } from '../hooks';
import { Spin } from 'antd';

const Editor = ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) => {
  const id = generateUUID();
  const responsive = useResponsive();
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    setLoading(true);
    new Vditor(`vditor-${id}`, {
      cache: {
        enable: false,
      },
      toolbarConfig: {
        pin: true,
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
        : [
            'ordered-list',
            'fullscreen',
            {
              name: 'more',
              toolbar: [
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
              ],
            },
          ],
      resize: {
        enable: true,
      },
      input: (v) => {
        onChange && onChange(v);
      },
      outline: {
        enable: true,
        position: 'left',
      },
      minHeight: 200,
      placeholder,
      value: value || '',
      after() {
        setLoading(false);
      },
    });
  }, []);
  return (
    <>
      {loading && <Spin />}
      <div id={`vditor-${id}`} className="ndzy-vditor" />
    </>
  );
};
export default Editor;
