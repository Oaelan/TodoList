import { useRouter } from "next/router";
import Image from "next/image";
import { getTodo, updateTodo, deleteTodo, uploadImages } from "@/api/todoApi";
import { useQuery } from "@tanstack/react-query";
import { TodoItem, UpdateTodoDto } from "@/TodoListType";
import { useEffect, useRef, useState } from "react";
import CheckTodoList from "@/components/CheckTodoList";
export default function Detail() {
  //상세 페이지로 이동할 때 들고온 id 값으로 서버에 요청해서 todoItem 값을 가져오기
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useQuery({
    queryKey: ["getTodo", id],
    //상세 페이지로 이동후 새로고침시에 id값이 NaN이 되는 문제 해결하기위해
    queryFn: () => (id ? getTodo(Number(id)) : Promise.resolve(null)), // id가 유효할 때만 요청
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
  //업로드된 이미지 파일
  const [uploadedImage, setUploadedImage] = useState<File | string>("");
  //투두 메모 내용
  const [memo, setMemo] = useState<string>("");
  //파일 업로드 참조 요소
  const fileInputRef = useRef<HTMLInputElement>(null);
  //파일 업로드 이미지 파일
  const fileImgRef = useRef<File>(null);
  //삭제 버튼 디바운싱
  const deleteDebounceRef = useRef<NodeJS.Timeout | null>(null);
  //수정 버튼 디바운싱
  const updateDebounceRef = useRef<NodeJS.Timeout | null>(null);

  //상세 페이지에서 보여질 todoItem 값
  const [todo, setTodo] = useState<TodoItem>({
    id: 0,
    tenantId: "",
    name: "",
    memo: "",
    imageUrl: "",
    isCompleted: false,
  });
  //투두 완료 전/후 상태 체크
  const handleCheckTodo = async () => {
    console.log("todo", todo);
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
  //클릭시 투두 삭제 버튼
  const handleDeleteTodoClick = async () => {
    if (deleteDebounceRef.current) {
      clearTimeout(deleteDebounceRef.current);
    }
    //0.5초 디바운싱
    deleteDebounceRef.current = setTimeout(async () => {
      await deleteTodo(Number(id));
      router.push("/");
    }, 500);
  };
  //파일 업로드 버튼 클릭시 파일 입력 요소 클릭
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 입력 요소 클릭
    }
  };
  //파일 업로드 후 파일 state값 변경
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // 파일 크기 체크 (5MB 이하)
      console.log("file.size", file.size, 5 * 1024 * 1024);
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하이어야 합니다.");
        return;
      }
      // 파일명 체크 (영어로만)
      const fileNamePattern = /^[a-zA-Z0-9_.-]+$/; // 영어, 숫자, _, -, . 만 허용
      if (!fileNamePattern.test(file.name)) {
        alert("파일명은 영어로만 작성해야 합니다.");
        return;
      }
      // 첫 번째 파일을 상태에 저장 이미지 파일 선택 후 미리보기를 하기 위함!
      setUploadedImage(file);
      fileImgRef.current = file;
    }
  };
  //투두 수정  버튼
  const handleEditTodoClick = async () => {
    //수정버튼 디바운싱
    if (updateDebounceRef.current) {
      clearTimeout(updateDebounceRef.current);
    }
    updateDebounceRef.current = setTimeout(async () => {
      let imgUrl = "";
      //수정시 업로드한 이미지 파일이 있을경우 url 반환
      if (fileImgRef.current) {
        imgUrl = await uploadImages(fileImgRef.current);
        console.log("imgUrl", imgUrl);
        setUploadedImage(imgUrl);
      }
      //수정시 업로드한 이미지 파일이 없을경우 기존 이미지 사용
      const updateTodoItem: UpdateTodoDto = {
        name: todo.name,
        isCompleted: todo.isCompleted,
        imageUrl: imgUrl ? imgUrl : todo.imageUrl,
        memo: memo,
      };
      await updateTodo(Number(id), updateTodoItem);
      router.push("/");
    }, 500);
  };

  useEffect(() => {
    if (data) {
      //상세 페이지에대한 투두 값 상태값 설정
      setTodo(data);
      setMemo(data.memo || "");
      setUploadedImage(data.imageUrl || "");
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
          className={`col-span-1 lg:col-span-4 imgUpload h-[300px] bg-default-100
  ${uploadedImage ? "" : "border-dashed border-[1.5px]"} 
        border-default-300 rounded-4xl flex flex-col
        items-center justify-center relative`}
        >
          {/* 이미지 업로드 아이콘 또는 업로드한 이미지 표시 */}
          <div className="w-full h-full flex items-center justify-center">
            {uploadedImage ? (
              <Image
                src={
                  typeof uploadedImage === "string"
                    ? uploadedImage
                    : URL.createObjectURL(uploadedImage)
                }
                alt="Uploaded Image"
                width={60}
                height={60}
                className="w-full h-full object-cover rounded-4xl"
              />
            ) : (
              <Image
                src="/ic/img@3x.png" // 기본 이미지
                alt="upload"
                width={60}
                height={60}
                className="mb-4"
                onClick={handleFileUploadClick} // 클릭 시 파일 입력 트리거
              />
            )}
          </div>
          {uploadedImage ? (
            //파일 수정 버튼
            <button
              className="absolute bottom-4 right-4 cursor-pointer
            bg-default-800/60 hover:bg-default-500/60
            p-4 rounded-full border-2 border-default-900"
            >
              <Image
                src="/ic/edit@3x.png"
                alt="edit"
                width={20}
                height={20}
                onClick={handleFileUploadClick} // 버튼 클릭 시 파일 입력 트리거
              />
            </button>
          ) : (
            //업로드 버튼
            <button
              className="absolute bottom-4 right-4 cursor-pointer
            bg-default-200 hover:bg-default-300 p-4 rounded-full"
            >
              <Image
                src="/ic/Variant2@3x.png"
                alt="upload"
                width={20}
                height={20}
                onClick={handleFileUploadClick} // 버튼 클릭 시 파일 입력 트리거
              />
            </button>
          )}
          {/* 파일 입력 요소 (숨김) */}
          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        {/* 메모 */}
        <div
          className="col-span-1 lg:col-span-6 memo h-[300px] flex flex-col items-center p-5
        bg-default-300 bg-cover bg-[url('/img/memo@3x.png')]"
        >
          {/* 메모 제목 */}
          <h1 className="text-post-title nanum-bold-16">Memo</h1>
          {/* 메모 입력 영역 */}
          <textarea
            className="mt-5 text-center w-full h-full resize-none outline-none bg-transparent"
            placeholder="메모를 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex gap-3 justify-center lg:justify-end">
        <button
          onClick={handleEditTodoClick}
          className={`cursor-pointer button-shadow
          ${uploadedImage ? "bg-modify-300" : "bg-default-200"} rounded-full
          px-7 py-2 flex items-center justify-center`}
        >
          <Image
            src="/ic/check@3x.png"
            alt="edit"
            width={15}
            height={15}
            className="mr-2"
          />
          <div className="nanum-regular-14 text-default-900">수정 완료</div>
        </button>
        <button
          className="cursor-pointer button-shadow bg-delete-600 rounded-full
        px-7 py-2 flex items-center justify-center"
          onClick={handleDeleteTodoClick}
        >
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
