import Image from "next/image";
import { useState } from "react";
import { TodoList, TodoItem, NewTodoItem } from "../TodoListType";
import CheckTodoList from "../components/CheckTodoList";
import { getTodoList, addTodoList } from "@/api/todoApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
//메인 페이지
export default function Home() {
  //투두리스트들을 담을 배열 (메인 페이지에서 보여줄 state)
  const [todoList, setTodoList] = useState<TodoList>([]);
  //투두리스트에 추가할 인풋값에서 받은 값
  const [addValue, setAddValue] = useState("");
  //서버에 API 요청으로 투두리스트 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ["getTodoList"],
    queryFn: getTodoList,
  });
  const queryClient = useQueryClient();

  //마운트 후에 할일이 추가가 될때마다 getTodoList 쿼리 리프레쉬 하기 위함
  const mutation = useMutation({
    mutationFn: addTodoList,
    onSuccess: () => {
      // 추가된 할일의 정보를 가져오기 위해 쿼리 리프레시
      queryClient.invalidateQueries({ queryKey: ["getTodoList"] });
    },
  });

  //추가 버튼 클릭시 일정 등록 이벤트
  const handleAddClick = () => {
    const newTodo: NewTodoItem = {
      name: addValue,
    };
    mutation.mutate(newTodo);
    setAddValue("");
  };
  //인풋창에 값 입력시 addValue 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddValue(e.target.value);
  };
  // 부모 컴포넌트에서의 상태 업데이트 함수
  // const onToggleComplete = (updatedTodo: TodoItem) => {
  //   setTodoList((prevList) =>
  //     prevList.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
  //   );
  // };

  useEffect(() => {
    if (data) {
      setTodoList(data);
    }
  }, [data]);

  //로딩 중일때 로딩 스피너 보여주기
  if (isLoading) {
    return <div>Loading...</div>;
  }
  //에러 발생시 에러 메시지 보여주기
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="bg-white Home min-h-screen py-10 flex flex-col gap-5 px-[5%] lg:px-[20%]">
      <div className="flex justify-center gap-5">
        <input
          className="button-shadow rounded-full p-2 pl-4 w-[80%]"
          type="text"
          placeholder="할 일을 입력하세요"
          onChange={handleInputChange}
          value={addValue}
        />
        <button
          onClick={handleAddClick}
          className={`button-shadow cursor-pointer nanum-regular-16 flex items-center justify-center rounded-full p-2 w-[15%] gap-2 ${
            todoList.length > 0
              ? "bg-add-200 text-default-900"
              : "bg-add-600 text-default-100"
          }`}
        >
          {todoList.length > 0 ? (
            <>
              {/* 투두리스트 있을때 버튼 스타일 */}
              <Image
                className="hidden md:block"
                src="/ic/Variant2@3x.png"
                alt="add"
                width={20}
                height={20}
              />
              <Image
                className="block md:hidden"
                src="/ic/Variant2@2x.png"
                alt="add"
                width={15}
                height={15}
              />
            </>
          ) : (
            <>
              {/* 투두리스트 없을떄 버튼 스타일 */}
              <Image
                className="hidden md:block"
                src="/ic/plus@3x.png"
                alt="add"
                width={20}
                height={20}
              />
              <Image
                className="block md:hidden"
                src="/ic/plus@2x.png"
                alt="add"
                width={15}
                height={15}
              />
            </>
          )}
          <span className="hidden md:block">추가하기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 mt-10">
        <div className="ToDo flex flex-col py-6 gap-5 md:px-4 sm:px-0">
          <div className="">
            <Image src="/img/todo@3x.png" alt="todo" width={120} height={120} />
          </div>

          <div
            className={`mb-4 flex ${
              todoList.length > 0 &&
              todoList.filter((todo) => !todo.isCompleted).length > 0
                ? "flex-col gap-3 min-h-[300px]"
                : "justify-center h-[300px]"
            }`}
          >
            {/* 완료되지 않은 할 일만 보여줌 */}
            {todoList.length > 0 &&
            todoList.filter((todo) => !todo.isCompleted).length > 0 ? (
              todoList
                .filter((todo) => !todo.isCompleted)
                .map((todo) => (
                  <CheckTodoList
                    key={todo.id}
                    todoItem={todo}
                    invalidateQueryKey="getTodoList"
                  />
                ))
            ) : (
              <Image
                src="/img/Type=TodoSize=Large@3x.png"
                alt="todoSize"
                width={180}
                height={180}
                className="object-contain"
              />
            )}
          </div>
          {todoList.length > 0 &&
          todoList.filter((todo) => !todo.isCompleted).length > 0 ? null : (
            <div className="text-center text-gray-500 flex flex-col">
              <span>완료된 할 일이 없어요.</span>
              <span>해야 할 일을 체크해보세요!</span>
            </div>
          )}
        </div>

        <div className="Done flex flex-col py-6 gap-5 md:px-4 sm:px-0">
          <div className="">
            <Image src="/img/done@3x.png" alt="done" width={120} height={120} />
          </div>
          <div
            className={`mb-4 flex ${
              todoList.length > 0 &&
              todoList.filter((todo) => todo.isCompleted).length > 0
                ? "flex-col gap-3"
                : "justify-center h-[300px]"
            }`}
          >
            {todoList.length > 0 &&
            todoList.filter((todo) => todo.isCompleted).length > 0 ? (
              todoList
                .filter((todo) => todo.isCompleted)
                .map((todo) => <CheckTodoList key={todo.id} todoItem={todo} />)
            ) : (
              <Image
                src="/img/Type=DoneSize=Large@3x.png"
                alt="doneSize"
                width={180}
                height={180}
                className="object-contain"
              />
            )}
          </div>
          {todoList.length > 0 &&
          todoList.filter((todo) => todo.isCompleted).length > 0 ? null : (
            <div className="text-center text-gray-500 flex flex-col">
              <span>완료된 할 일이 없어요.</span>
              <span>해야 할 일을 체크해보세요!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
