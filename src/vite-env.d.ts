/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

interface ITodo {
  id: string;
  name: string;
  detail: string;
  link: string;
  [k: string]: any;
}

interface ITodoRecord {
  name: string;
  detail: string;
  link: string;
  [k: string]: any;
}
