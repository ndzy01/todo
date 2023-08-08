/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount } from 'ahooks';
import serviceAxios from './http';
import { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { InputRef, Space, Spin } from 'antd';
import { Input, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ITag: React.FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const getAllTags = () => {
    setLoading(true);
    serviceAxios('/tags')
      .then((res) => {
        setTags(res.data || []);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
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
    setLoading(true);
    serviceAxios
      .delete(`/tags/${id}`)
      .then(() => {
        getAllTags();
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (!inputValue) {
      setInputVisible(false);
      setInputValue('');

      return;
    }

    setLoading(true);
    serviceAxios
      .post('/tags', { name: inputValue })
      .then(() => {
        getAllTags();
        setInputVisible(false);
        setInputValue('');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={goHome}>
          返回首页
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space>
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
          </Space>
          <div style={{ padding: 16 }}>
            {inputVisible ? (
              <Input.TextArea
                ref={inputRef}
                size="small"
                style={{ width: 300 }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            ) : (
              <Tag onClick={showInput}>
                <PlusOutlined /> 添加标签
              </Tag>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ITag;
