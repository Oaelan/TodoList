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
      className={`p-2 flex items-center ${
        invalidateQueryKey === "detail"
          ? "rounded-2xl justify-center"
          : "rounded-full"
      } ${
        todoItem.isCompleted ? "bg-add-100 line-through" : "bg-white"
      } border-default-900 border-2 nanum-regular-16`}
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
          invalidateQueryKey === "detail" ? "w-fit" : "w-full"
        }`}
        onClick={() => handleDetailTodoClick(todoItem)}
      >
        {todoItem.name}
      </div>
    </div>
  );
}

export default CheckTodoList;
