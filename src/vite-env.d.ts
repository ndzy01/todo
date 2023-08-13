/// <reference types="vite/client" />

interface ITodo {
  id: string;
  name: string;
  detail: string;
  link: string;
  tagId: string;
  deadline: string;
}

interface ITodoRecord {
  name: string;
  detail: string;
  link: string;
  tagId: string;
  deadline: string;
}

interface TodoTag {
  id: string;
  name: string;
  userName: string;
}

interface User {
  id: string;
  nickname: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
