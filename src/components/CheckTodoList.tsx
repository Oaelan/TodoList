import { updateTodo } from "@/api/todoApi";
import { TodoItem, UpdateTodoDto } from "@/TodoListType";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
interface OwnProps {
  todoItem: TodoItem;
  invalidateQueryKey: string;
}

//체크 투두 리스트 컴포넌트

function CheckTodoList({ todoItem, invalidateQueryKey }: OwnProps) {
  const queryClient = useQueryClient(); // QueryClient 인스턴스 가져오기

  const mutation = useMutation({
    mutationFn: (updatedTodo: UpdateTodoDto) =>
      updateTodo(todoItem.id, updatedTodo),
    onSuccess: () => {
      // 성공적으로 업데이트된 후 getTodoList 쿼리 리프레시
      //queryClient.invalidateQueries({ queryKey: ["getTodo"] });
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
    },
  });
  //완료 체크하기 이벤트
  const handleCheckTodo = (
    todoItem: TodoItem
    //onToggleComplete: (updatedTodo: TodoItem) => void
  ) => {
    const updatedTodoItem = {
      memo: todoItem.memo ? todoItem.memo : "",
      isCompleted: !todoItem.isCompleted, // completed 속성만 반전
      imageUrl: todoItem.imageUrl ? todoItem.imageUrl : "",
      name: todoItem.name,
    };
    mutation.mutate(updatedTodoItem);
  };

  const router = useRouter();
  // 상세페이지 이동하기 이벤트
  const handleDetailTodoClick = (todoItem: TodoItem) => {
    router.push(`/detail/${todoItem.id}`);
  };
  return (
    <div
      className={`p-2 flex items-center rounded-full
  ${
    todoItem.isCompleted ? "bg-add-100 line-through" : "bg-white"
  } border-default-900 border-2
     nanum-regular-16`}
    >
      <Image
        src={
          todoItem.isCompleted ? "/ic/Frame2610233@3x.png" : "/ic/Default.png"
        }
        alt="check"
        width={25}
        height={25}
        className="mr-2 cursor-pointer"
        onClick={() => handleCheckTodo(todoItem)}
      />
      <div
        className="cursor-pointer w-full"
        onClick={() => handleDetailTodoClick(todoItem)}
      >
        {todoItem.name}
      </div>
    </div>
  );
}

export default CheckTodoList;
