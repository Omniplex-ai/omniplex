import Web from '../../public/svgs/options/Web.svg';
import Academic from '../../public/svgs/options/Academic.svg';
import Writing from '../../public/svgs/options/Writing.svg';
import Youtube from '../../public/svgs/options/Youtube.svg';
import Reddit from '../../public/svgs/options/Reddit.svg';
import Stackoverflow from '../../public/svgs/options/Stackoverflow.svg';
import { image } from '@nextui-org/react';

export const focusOptions = [
	{
		website: 'All',
		icon: Web,
		query: '',
		description: 'Search across the entire internet',
	},
	{
		website: 'Academic',
		icon: Academic,
		query: 'site:arxiv.org',
		description: 'Search in published academic papers',
	},
	{
		website: 'Writing',
		icon: Writing,
		query: '',
		description: 'Generate text without searching the web',
	},
	{
		website: 'Youtube',
		icon: Youtube,
		query: 'site:youtube.com',
		description: 'Discover and watch videos on YouTube',
	},
	{
		website: 'Reddit',
		icon: Reddit,
		query: 'site:reddit.com',
		description: 'Search for discussions and opinions online',
	},
	{
		website: 'Stackoverflow',
		icon: Stackoverflow,
		query: 'site:stackoverflow.com',
		description: 'Get answers to your programming questions',
	},
];

export const MODELS = [{ label: 'gpt-4', value: 'gpt-4-turbo-2024-04-09' }];

export const PLUGINS = [
	{
		tag: 'Built In',
		name: 'Stocks',
		comingSoon: false,
		url: '',
		description: 'Check stock prices',
		imageUrl:
			'https://cdn.vectorstock.com/i/500p/73/79/analysis-stock-market-black-icon-on-white-vector-31617379.jpg',
	},
	{
		tag: 'Built In',
		name: 'Weather',
		comingSoon: false,
		url: '',
		description: 'Weather forecast',
		imageUrl:
			'https://t4.ftcdn.net/jpg/09/87/70/03/240_F_987700389_T1rq1vNtPSZzceXrEXHsdrJQF22yhdn5.jpg',
	},
	{
		tag: 'Built In',
		name: 'Dictionary',
		comingSoon: false,
		url: '',
		description: 'Look up word definitions',
		imageUrl:
			'https://t4.ftcdn.net/jpg/00/90/67/23/240_F_90672351_aMnnWdxVtuAIUubWBVVMXotZvoKjdd73.jpg',
	},
];
