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
export const addTodoList = async (newTodo: NewTodoItem): Promise<TodoItem> => {
  const response = await axios.post(`${API_URL}`, newTodo);
  return response.data; // 서버에서 생성된 TodoItem 전체 반환
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
): Promise<TodoItem> => {
  const response = await axios.patch(`${API_URL}/${id}`, updatedTodo);
  return response.data; // 서버에서 업데이트된 TodoItem 전체 반환
};
