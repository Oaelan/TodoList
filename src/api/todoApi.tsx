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
  console.log("addTodoList 호출");
  const response = await axios.post(`${API_URL}`, newTodo);
  return response.data; // 서버에서 생성된 TodoItem 전체 반환
};

//투두 데이터 요청
export const getTodo = async (id: number): Promise<TodoItem> => {
  console.log("getTodo 호출 , id : ", id);
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

// 투두 데이터 삭제
export const deleteTodo = async (id: number): Promise<string> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data + "삭제 완료"; // 성공적으로 삭제된 경우
  } catch (error) {
    console.error("삭제 실패:", error);
    throw new Error("투두 삭제에 실패했습니다."); // 오류를 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

//이미지 업로드 후 이미지 주소 반환
export const uploadImages = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await axios.post(
    `https://assignment-todolist-api.vercel.app/api/codeitTodoListAelan0201/images/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
