import { useRouter } from "next/router";
import Image from "next/image";
import { getTodo, updateTodo } from "@/api/todoApi";
import { useQuery } from "@tanstack/react-query";
import { TodoItem, UpdateTodoDto } from "@/TodoListType";
import { useEffect, useState } from "react";
import CheckTodoList from "@/components/CheckTodoList";
export default function Detail() {
  //상세 페이지로 이동할 때 들고온 id 값으로 서버에 요청해서 todoItem 값을 가져오기
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useQuery({
    queryKey: ["getTodo", id],
    queryFn: () => getTodo(Number(id)),
  });
  const [todo, setTodo] = useState<TodoItem>({
    id: 0,
    tenantId: "",
    name: "",
    memo: "",
    imageUrl: "",
    isCompleted: false,
  });
  const handleCheckTodo = async () => {
    const updatedTodoItem: UpdateTodoDto = {
      name: todo.name,
      isCompleted: !todo.isCompleted, // completed 속성만 반전
      imageUrl: todo.imageUrl ? todo.imageUrl : "",
      memo: todo.memo ? todo.memo : "",
    };
    //업데이트할 투두값
    const updatedTodo = await updateTodo(Number(id), updatedTodoItem);
    //업데이트된 투두값을 투두리스트에 적용
    setTodo(updatedTodo);
  };
  useEffect(() => {
    if (data) {
      setTodo(data);
    }
  }, [data]);

  // 로딩 중일 때
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러 발생 시
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="Detail h-screen bg-white mx-0 lg:mx-[20%] lg:px-20  px-5 pt-5 flex flex-col gap-5">
      {/* 투두리스트 이름 영역 */}
      <CheckTodoList
        todoItem={todo}
        invalidateQueryKey="detail"
        handleCheckTodo={handleCheckTodo}
      />
      {/* 이미지 업로드 & 메모 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
        {/* 이미지 업로드 영역 */}
        <div
          className="col-span-1 lg:col-span-4 imgUpload h-[300px] bg-default-100
        border-dashed border-[1.5px] border-default-300 rounded-lg flex flex-col items-center justify-center relative"
        >
          {/* 메인 이미지 */}
          <Image
            src="/ic/img@3x.png"
            alt="upload"
            width={60}
            height={60}
            className="mb-4"
          />

          {/* 업로드 버튼 */}
          <button className="absolute bottom-4 right-4 cursor-pointer bg-default-200 rounded-full p-3">
            <Image
              src="/ic/Variant2@3x.png"
              alt="upload"
              width={15}
              height={15}
            />
          </button>
        </div>
        {/* 메모 */}
        <div
          className="col-span-1 lg:col-span-6 memo h-[300px] flex flex-col items-center p-5
        bg-default-300 bg-cover bg-[url('/img/memo@3x.png')]"
        >
          {/* 메모 제목 */}
          <h1 className="text-post-title nanum-bold-20">Memo</h1>
          {/* 메모 입력 영역 */}
          <textarea
            className="mt-20 text-center w-full h-full resize-none outline-none bg-transparent"
            placeholder="메모를 입력하세요"
          />
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex gap-3 justify-center lg:justify-end">
        <button className="button-shadow bg-default-200 rounded-full px-7 py-2 flex items-center justify-center">
          <Image
            src="/ic/check@3x.png"
            alt="edit"
            width={15}
            height={15}
            className="mr-2"
          />
          <div className="nanum-regular-14 text-default-900">수정 완료</div>
        </button>
        <button className="button-shadow bg-delete-600 rounded-full px-7 py-2 flex items-center justify-center">
          <Image
            src="/ic/X@3x.png"
            alt="edit"
            width={15}
            height={15}
            className="mr-2"
          />
          <div className="nanum-regular-14 text-white">삭제 하기</div>
        </button>
      </div>
    </div>
  );
}
