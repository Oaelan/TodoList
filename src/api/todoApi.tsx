import axios from "axios";
import { NewTodoItem, TodoItem, TodoList, UpdateTodoDto } from "@/TodoListType";
//내 투두리스트 아이디
const TENANT_ID = "codeitTodoListAelan0201";
//투두리스트 데이터 요청 주소
const API_URL = `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items`;

//투두리스트 데이터 요청
export const getTodoList = async (): Promise<TodoList> => {
  console.log("getTodoList 호출");
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

//투두리스트 데이터 추가
export const addTodoList = async (newTodo: NewTodoItem): Promise<void> => {
  await axios.post(`${API_URL}`, newTodo);
};

//투두 데이터 요청
export const getTodo = async (id: number): Promise<TodoItem> => {
  console.log("getTodo 호출");
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

//투두 데이터 수정
export const updateTodo = async (
  id: number,
  updatedTodo: UpdateTodoDto
): Promise<void> => {
  await axios.patch(`${API_URL}/${id}`, updatedTodo);
};
