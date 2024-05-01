import Web from "../../public/svgs/options/Web.svg";
import Academic from "../../public/svgs/options/Academic.svg";
import Writing from "../../public/svgs/options/Writing.svg";
import Youtube from "../../public/svgs/options/Youtube.svg";
import Reddit from "../../public/svgs/options/Reddit.svg";
import Stackoverflow from "../../public/svgs/options/Stackoverflow.svg";

export const focusOptions = [
  {
    website: "All",
    icon: Web,
    query: "",
    description: "Search across the entire internet",
  },
  {
    website: "Academic",
    icon: Academic,
    query: "site:arxiv.org",
    description: "Search in published academic papers",
  },
  {
    website: "Writing",
    icon: Writing,
    query: "",
    description: "Generate text without searching the web",
  },
  {
    website: "Youtube",
    icon: Youtube,
    query: "site:youtube.com",
    description: "Discover and watch videos on YouTube",
  },
  {
    website: "Reddit",
    icon: Reddit,
    query: "site:reddit.com",
    description: "Search for discussions and opinions online",
  },
  {
    website: "Stackoverflow",
    icon: Stackoverflow,
    query: "site:stackoverflow.com",
    description: "Get answers to your programming questions",
  },
];

export const MODELS = [
  { label: "gpt-4", value: "Most powerful GPT-4 model. Best when you need very precise answer. Can Be Slow!" },
  { label: "gpt-3.5-turbo", value: "Very good model. Best when you need good and fast responses." },

];
