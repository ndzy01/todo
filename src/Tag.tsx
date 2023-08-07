/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount } from 'ahooks';
import serviceAxios from './http';
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Input, Tag } from 'antd';

const ITag: React.FC = () => {
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const getAllTags = () => {
    serviceAxios('/tags').then((res) => {
      setTags(res.data || []);
    });
  };

  useMount(() => {
    getAllTags();
  });

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (id: string) => {
    serviceAxios.delete(`/tags/${id}`).then(() => {
      getAllTags();
    });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    serviceAxios.post('/tags', { name: inputValue }).then(() => {
      getAllTags();
      setInputVisible(false);
      setInputValue('');
    });
  };

  return (
    <>
      {tags.map((item) => (
        <Tag
          key={item.id}
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(item.id);
          }}
        >
          {item.name}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput}>
          <PlusOutlined /> 添加分类
        </Tag>
      )}
    </>
  );
};

export default ITag;
