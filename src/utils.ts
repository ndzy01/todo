import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';

export const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
export const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().endOf('day');
};
export const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});
export const generateUUID = (): string => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now();
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
const getKey = () => {
  let key = '';
  for (let index = 0; index < 8; index++) {
    key += generateUUID().replace(/-/g, '');
  }
  return key;
};
// 解密
export const decrypt = (text: string, keyBase: string, ivBase: string) => {
  const key = CryptoJS.enc.Utf8.parse(keyBase);
  const iv = CryptoJS.enc.Utf8.parse(ivBase);
  const encryptedHexStr = CryptoJS.enc.Hex.parse(text);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    hasher: CryptoJS.algo.SHA256,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};
// 加密
export const encrypt = (text: string) => {
  const keyBase = getKey();
  const ivBase = getKey();
  const key = CryptoJS.enc.Utf8.parse(keyBase);
  const iv = CryptoJS.enc.Utf8.parse(ivBase);
  const srcs = CryptoJS.enc.Utf8.parse(text);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    hasher: CryptoJS.algo.SHA256,
  });
  return {
    keyBase,
    ivBase,
    text: encrypted.ciphertext.toString().toUpperCase(),
  };
};
