import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";

// try catch 등의 예외처리를 추가하세요.
export async function POST(request: Request) {
	// 아래 3개 인증 관련 상수에 대한 환경변수를 추가하세요.
	const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
	const OPEN_AI_ORGANIZATION_ID = process.env.OPEN_AI_ORGANIZATION_ID;
	const OPEN_AI_PROJECT_ID = process.env.OPEN_AI_PROJECT_ID;
	const openai = new OpenAI({
		organization: OPEN_AI_ORGANIZATION_ID,
		project: OPEN_AI_PROJECT_ID,
		apiKey: OPEN_AI_API_KEY,
	});

	// 사용자의 최근 질문과 함께 이전 질문 내용도 함께 가져옴
	const body = await request.json();
	const chats: ChatCompletionMessageParam[] = await body.chats;

	// OpenAI config
	const gptModel = "gpt-3.5-turbo";
	const systemDefaultRole = "You are a helpful korean coding helper.";
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content: systemDefaultRole,
			},
			...chats,
		],
		model: gptModel,
	});
	// 통계용 DB에 로그 추가
	return Response.json({
		result: completion.choices[0].message,
	});
}
