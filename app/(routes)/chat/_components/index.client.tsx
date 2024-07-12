"use client";

import { basicChatApi } from "@/app/_lib/apis/basicChatApi.client";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { useEffect, useState } from "react";

export default function BasicChatApiPageComponents() {
	// 채팅 보관
	const [chats, setChats] = useState<[] | ChatCompletionMessageParam[]>([]);
	// 사용자 입력값
	const [userInput, setUserInput] = useState<string>("");
	// 에러 여부
	const [isError, setIsError] = useState<boolean>(false);
	// 답변 생성 로딩 여부 - state값에 따라 로딩 말풍선 노출 여부 결정
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// input onChange handler function
	const inputOnChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setUserInput(e.currentTarget.value);
	};

	// chats state에 새로운 채팅 추가
	const addChats = (role: "system" | "user" | "assistant", chat: string) => {
		setChats((prev) => [...prev, { role: role, content: chat }]);
	};

	// form submit handler function
	const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// input이 없을 시 return
		if (userInput.length === 0) {
			return;
		}
		// 에러 여부 초기화
		setIsError(false);
		// 사용자 채팅 추가
		addChats("user", userInput);
		// 로딩 말풍선 on
		setIsLoading(true);
		// 사용자 답변 비움
		setUserInput("");
	};

	// API call
	const getResponse = async () => {
		const result = await basicChatApi(chats);
		// 로딩 말풍선 off
		setIsLoading(false);
		// 제대로 response가 도달하지 않았을 시 에러 표시 후 return;
		if (!result.result) {
			setIsError(true);
			return;
		}
		// 답변 채팅 추가
		setChats((prev) => [
			...prev,
			{
				role: "assistant",
				content: result.result.content,
			},
		]);
	};

	// user의 채팅이 추가되면 API call
	useEffect(() => {
		const lastChat = chats.at(-1);
		if (lastChat?.role !== "user") {
			return;
		}
		getResponse();
	}, [chats]);
	return (
		<section className="relative w-full h-full">
			{/* chats */}
			<section className="w-full h-full overflow-scroll space-y-[12px]">
				{chats.map((chat, i) => {
					return (
						<div
							key={i}
							className={`${
								chat.role === "assistant" ? "justify-start" : "justify-end"
							} w-full flex`}
						>
							<div
								className={`${
									chat.role === "assistant"
										? "bg-[#f2f2f3] rounded-r-common rounded-bl-common"
										: "bg-black rounded-l-common rounded-br-common"
								} w-[80%]`}
							>
								<p
									className={`${
										chat.role === "assistant" ? "text-black" : "text-white"
									} text-14 p-[10px]`}
								>
									{chat.content as string}
								</p>
							</div>
						</div>
					);
				})}
				{isLoading && (
					<div className="bg-[#f2f2f3] rounded-r-common rounded-bl-common w-[80%]">
						<p className="text-gray-400 text-14 p-[10px]">로딩중...</p>
					</div>
				)}
			</section>
			<form
				className="absolute bottom-0 w-full flex flex-col items-center gap-[14px]"
				onSubmit={onSubmitHandler}
			>
				{isError && (
					<p className="text-12 text-red-600">에러가 발생하였습니다.</p>
				)}
				<textarea
					className="w-full border-gray-200 border-[1px] resize-none rounded-common p-[12px] text-14"
					onChange={inputOnChangeHandler}
					value={userInput}
					placeholder="질문을 입력해주세요."
				/>
				<button
					className={`${
						isLoading || userInput.length === 0 ? "bg-gray-400" : "bg-black"
					} mb-[10px] py-[12px] px-[10px] text-white w-full rounded-common text-15`}
				>
					전송
				</button>
			</form>
		</section>
	);
}
