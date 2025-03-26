export const TENANT_ID = "codeitTodoAelan0201";

//메인 페이지에서 보여줄 투두리스트들
export type TodoList = TodoItem[];

//투드리스트 1개의 정보를 담는 타입
export type TodoItem = {
  id: number;
  tenantId: string; // tenantId
  name: string;
  memo?: string;
  imageUrl?: string;
  isCompleted: boolean;
  isEditing?: boolean; // 프론트엔드에서만 사용 (선택적 속성)
  isSelected?: boolean; // 프론트엔드에서만 사용 (선택적 속성)
};

export type NewTodoItem = {
  name: string;
};

export type UpdateTodoDto = {
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
};
