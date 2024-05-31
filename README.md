![hero](Github.png)

<p align="center">
	<h1 align="center"><b>Omniplex</b></h1>
<p align="center">
    Open-Source Perplexity
    <br />
    <br />
    <a href="https://omniplex.ai">Website</a>
    ·
    <a href="https://discord.gg/87Mh7q5ZSd">Discord</a>
    ·
    <a href="https://www.reddit.com/r/omniplex_ai">Reddit</a>
  </p>
</p>

# :construction: Under Active Development

> Our focus is on establishing core functionality and essential features. As we continue to develop Omniplex, we are committed to implementing best practices, refining the codebase, and introducing new features to enhance the user experience.

## Get started

To run the project, modify the code in the Chat component to use the `// Development Code`.

1. Fork & Clone the repository

```bash
git clone git@github.com:[YOUR_GITHUB_ACCOUNT]/omniplex.git
```

2. Install the dependencies

```bash
yarn
```

3. Fill out secrets in `.env.local`

```bash
BING_API_KEY=
OPENAI_API_KEY=

OPENWEATHERMAP_API_KEY=
ALPHA_VANTAGE_API_KEY=
FINNHUB_API_KEY=
```

4. Run the development server

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Plugins Development

> This is just a hacky way but very easy to implement. We will be adding a more robust way to add plugins in the future. Feel free to understand from the sample plugin we have added.

1. Update the types in `types.ts` to include the new plugin data types.
2. Update the `tools` api in `api` to include the new plugin function call.
3. Update the `api.ts` in `utils` file to include the new plugin data.
4. Update the `chatSlice.ts` in `store` to include the new plugin reducer.
5. Create a new folder in the `components` directory for the UI of the plugin.
6. Update the `chat.tsx` to handle the new plugin in `useEffect`.
7. Call the plugin function and return the data as props to source.
8. Update the `source.ts` to use the plugin UI.
9. Lastly Update the `data.ts` in `utils` to show in the plugin tab.

## Multi-LLM Support: Example

1. Add the new LLM apiKey in env and add the related npm package.

```bash
ANTHROPIC_API_KEY=******
```

2. Update the `chat` in `api`

```ts
import Anthropic from "@anthropic-ai/sdk";
import { OpenAIStream, StreamingTextResponse } from "ai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const {
    messages,
    model,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
  } = await req.json();

  const response = await anthropic.messages.create({
    stream: true,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

3. Update the `data` in `utils`

```ts
export const MODELS = [
  { label: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
  { label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
  { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
];
```

## Disclaimer

> We recently transitioned from the pages directory to the app directory, which involved significant changes to the project structure and architecture. As a result, you may encounter some inconsistencies or rough edges in the codebase.

### Roadmap

- [x] Images & Videos for Search
- [x] Upload for Vision Model
- [x] Chat History for Users
- [x] Shared Chats & Fork
- [x] Settings for LLMs
- [x] Custom OG Metadata
- [x] Faster API Requests
- [x] Allow Multiple LLMs
- [x] Plugin Development
- [x] Function Calling with Gen UI

### App Architecture

- Language: TypeScript
- Frontend Framework: React
- State Management: Redux
- Web Framework: Next.js
- Backend and Database: Firebase
- UI Library: NextUI & Tremor
- CSS Framework: TailwindCSS
- AI SDK: Vercel AI SDK

### Services

- LLM: OpenAI
- Search API: Bing
- Weather API: OpenWeatherMap
- Stocks API: Alpha Vantage & Finnhub
- Dictionary API: WordnikFree Dictionary API
- Hosting & Analytics: Vercel
- Authentication, Storage & Database: Firebase

## Contributing

We welcome contributions from the community! If you'd like to contribute to Openpanel, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with descriptive messages
4. Push your changes to your forked repository
5. Submit a pull request to the main repository

Please ensure that your code follows our coding conventions and passes all tests before submitting a pull request.

## License

This project is licensed under the [AGPL-3.0 license](LICENSE).

## Contact

If you have any questions or suggestions, feel free to reach out to us at [Contact](https://bishalsaha.com/contact).

Happy coding! 🚀
