import Image from "next/image";
import { useState } from "react";
import {
  TodoList,
  NewTodoItem,
  TodoItem,
  UpdateTodoDto,
} from "../TodoListType";
import CheckTodoList from "../components/CheckTodoList";
import { getTodoList, addTodoList, updateTodo } from "@/api/todoApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

  //완료 체크하기 이벤트
  const handleCheckTodo = async (todoItem: TodoItem) => {
    const updatedTodoItem: UpdateTodoDto = {
      name: todoItem.name,
      isCompleted: !todoItem.isCompleted, // completed 속성만 반전
      imageUrl: todoItem.imageUrl ? todoItem.imageUrl : "",
      memo: todoItem.memo ? todoItem.memo : "",
    };
    //업데이트할 투두값
    const updatedTodo = await updateTodo(todoItem.id, updatedTodoItem);
    //업데이트된 투두값을 투두리스트에 적용
    const updatedTodoList = (todoList || []).map((todo: TodoItem) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    console.log("updatedTodoList", updatedTodoList);
    setTodoList(updatedTodoList);
  };

  //추가 버튼 클릭시 일정 등록 이벤트
  const handleAddClick = async () => {
    const newTodo: NewTodoItem = {
      name: addValue,
    };
    //서버에 투두리스트 추가
    const afterAddTodo = await addTodoList(newTodo);
    //투두리스트 리스트에 newTodo 추가
    setTodoList([...todoList, afterAddTodo]);
    //인풋창 초기화
    setAddValue("");
  };
  //인풋창에 값 입력시 addValue 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddValue(e.target.value);
  };

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
            <Image
              src="/img/todo@3x.png"
              alt="todo"
              width={120}
              height={120}
              className="w-auto h-auto object-contain"
            />
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
                    invalidateQueryKey="index"
                    handleCheckTodo={handleCheckTodo}
                  />
                ))
            ) : (
              <Image
                src="/img/Type=TodoSize=Large@3x.png"
                alt="todoSize"
                width={180}
                height={180}
                className="w-auto h-auto object-contain"
                priority
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
            <Image
              src="/img/done@3x.png"
              alt="done"
              width={120}
              height={120}
              className="w-auto h-auto object-contain"
            />
          </div>
          <div
            className={`mb-4 flex ${
              todoList.length > 0 &&
              todoList.filter((todo) => todo.isCompleted).length > 0
                ? "flex-col gap-3 min-h-[300px]"
                : "justify-center h-[300px]"
            }`}
          >
            {todoList.length > 0 &&
            todoList.filter((todo) => todo.isCompleted).length > 0 ? (
              todoList
                .filter((todo) => todo.isCompleted)
                .map((todo) => (
                  <CheckTodoList
                    key={todo.id}
                    todoItem={todo}
                    invalidateQueryKey="index"
                    handleCheckTodo={handleCheckTodo}
                  />
                ))
            ) : (
              <Image
                src="/img/Type=DoneSize=Large@3x.png"
                alt="doneSize"
                width={180}
                height={180}
                className="w-auto h-auto object-contain"
                priority
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
