import { AzureOpenAI } from 'openai';
import type {
	ChatCompletion,
	ChatCompletionCreateParamsNonStreaming,
} from 'openai/resources/index';

import { OpenAI } from 'openai';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = '2024-08-01-preview';
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_ID;

function getClient(): AzureOpenAI {
	return new AzureOpenAI({
		endpoint,
		apiKey,
		apiVersion,
	});
}

const openai = getClient();

export async function POST(req: Request) {
	if (req.method !== 'POST') {
		return new Response(
			JSON.stringify({
				error: 'Method not allowed, only POST requests are accepted.',
			}),
			{ status: 405 }
		);
	}

	const messages = await req.json();
	//console.log('Messages:', messages);
	//console.log('azure', openai);

	const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
		{
			type: 'function',
			function: {
				name: 'search',
				description: 'Search for information based on a query',
				parameters: {
					type: 'object',
					properties: {},
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'stock',
				description:
					'Get the latest stock information for a given symbol',
				parameters: {
					type: 'object',
					properties: {
						symbol: {
							type: 'string',
							description:
								'Stock symbol to fetch data for.',
						},
					},
					required: ['symbol'],
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'dictionary',
				description: 'Get dictionary information for a given word',
				parameters: {
					type: 'object',
					properties: {
						word: {
							type: 'string',
							description:
								'Word to look up in the dictionary.',
						},
					},
					required: ['word'],
				},
			},
		},
		{
			type: 'function',
			function: {
				name: 'weather',
				description: 'Get the current weather in a given location',
				parameters: {
					type: 'object',
					properties: {
						location: {
							type: 'string',
							description:
								'City name to fetch the weather for.',
						},
						unit: {
							type: 'string',
							enum: ['celsius', 'fahrenheit'],
							description: 'Temperature unit.',
						},
					},
					required: ['location'],
				},
			},
		},
		// Add more functions as needed
	];

	try {
		console.log('before request');
		const response = await openai.chat.completions.create({
			model: 'gpt-4', // Specify the model
			messages: messages,
			tools,
			tool_choice: 'auto',
		});

		console.log('Response:', response);
		// Check if tool_calls are present in the response
		const toolCalls = response.choices[0].message?.tool_calls;
		if (!toolCalls) {
			console.log(response.choices[0].message);
			return new Response(
				JSON.stringify({
					mode: 'chat',
					arg: response.choices[0].message,
				}),
				{
					status: 200,
				}
			);
		}

		// Process the tool calls if present
		const firstToolCall = toolCalls[0];
		const modeAndArguments =
			Object.keys(firstToolCall.function.arguments).length === 2
				? ''
				: firstToolCall.function.arguments;

		return new Response(
			JSON.stringify({
				mode: firstToolCall.function.name,
				arg: modeAndArguments,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to process the input' }),
			{ status: 500 }
		);
	}
}
