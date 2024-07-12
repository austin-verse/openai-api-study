import axios from "axios";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";

export const basicChatApi = async (
	chats: [] | ChatCompletionMessageParam[]
) => {
	try {
		const response = await axios({
			url: "/api/basic-chat-api",
			method: "POST",
			data: {
				chats: chats,
			},
		});
		const result = await response.data.result;
		return { result };
	} catch (error) {
		const result = null;
		return {
			result,
		};
	}
};
