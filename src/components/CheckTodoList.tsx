import { TodoItem } from "@/TodoListType";
import Image from "next/image";
import { useRouter } from "next/router";
interface OwnProps {
  todoItem: TodoItem;
  invalidateQueryKey: string;
  handleCheckTodo: (todoItem: TodoItem) => void;
}

//체크 투두 리스트 컴포넌트

function CheckTodoList({
  todoItem,
  invalidateQueryKey,
  handleCheckTodo,
}: OwnProps) {
  const router = useRouter();
  // 상세페이지 이동하기 이벤트
  const handleDetailTodoClick = (todoItem: TodoItem) => {
    router.push(`/detail/${todoItem.id}`);
  };

  return (
    <div
      className={`p-2 flex items-center border-default-900 border-2
        ${
          // 상세 페이지일때 스타일링 / 아닐 때 스타일링
          invalidateQueryKey === "detail"
            ? "rounded-2xl justify-center"
            : "rounded-full"
        } ${
        // 완료  후/ 전 배경색 스타일링
        todoItem.isCompleted ? "bg-add-100" : "bg-white"
      }`}
    >
      <Image
        src={
          todoItem.isCompleted
            ? "/ic/Frame2610233@3x.png"
            : "/ic/Default@3x.png"
        }
        alt="check"
        width={25}
        height={25}
        className="mr-2 cursor-pointer object-cover"
        onClick={() => handleCheckTodo(todoItem)}
        priority
      />
      <div
        className={`cursor-pointer ${
          invalidateQueryKey === "detail"
            ? "w-fit nanum-bold-16 underline"
            : "w-full nanum-regular-14"
        } ${
          invalidateQueryKey === "index" &&
          todoItem.isCompleted &&
          "line-through"
        }`}
        onClick={() => handleDetailTodoClick(todoItem)}
      >
        {todoItem.name}
      </div>
    </div>
  );
}

export default CheckTodoList;
