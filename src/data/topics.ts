/** @format */

import {Topic, ForumData} from '@/types';

export const TOPICS_DATA: Topic[] = [
	{
		id: 5,
		name: 'Art',
		subtopics: [
			{id: 29, name: 'Crafts'},
			{id: 30, name: 'Music'},
			{id: 31, name: 'Show'},
			{id: 37, name: 'Dance'},
			{id: 38, name: 'Literature'},
			{id: 39, name: 'Cinema'},
		],
	},
	{
		id: 1,
		name: 'Food And Health',
		subtopics: [
			{id: 10, name: 'Natural Medicine'},
			{id: 11, name: 'Nutrition'},
			{id: 12, name: 'Hygiene'},
			{id: 7, name: 'Growing'},
			{id: 8, name: 'Cooking'},
			{id: 9, name: 'Preserving'},
		],
	},
	{
		id: 2,
		name: 'Knowledge And Values',
		subtopics: [
			{id: 14, name: 'Astronomy'},
			{id: 15, name: 'Biology'},
			{id: 16, name: 'Geology'},
			{id: 20, name: 'Others'},
			{id: 13, name: 'Philosophy And Psychology'},
			{id: 17, name: 'History And Culture'},
		],
	},
	{
		id: 3,
		name: 'Physical And Mental Exercise',
		subtopics: [
			{id: 18, name: 'Games'},
			{id: 19, name: 'Warm-up'},
			{id: 21, name: 'Sports'},
			{id: 22, name: 'Active Meditation'},
			{id: 23, name: 'Passive Meditation'},
			{id: 36, name: 'Aerobics'},
		],
	},
	{
		id: 6,
		name: 'Ecotechnologies',
		subtopics: [
			{id: 33, name: 'Water'},
			{id: 40, name: 'Sustainable Fashion'},
			{id: 41, name: 'Energy'},
			{id: 42, name: 'Waste'},
			{id: 32, name: 'Bioconstruction'},
			{id: 34, name: 'Durable Tools'},
		],
	},
	{
		id: 4,
		name: 'Community And Nature',
		subtopics: [
			{id: 24, name: 'Together'},
			{id: 25, name: 'Nature'},
			{id: 26, name: 'Volunteering'},
			{id: 27, name: 'Ecotourism'},
			{id: 28, name: 'Warning'},
			{id: 35, name: 'Cooperatives'},
		],
	},
];

// Create a map for quick lookup
export const TOPICS_MAP = new Map(
	TOPICS_DATA.map((topic) => [topic.id, topic])
);

// Create a flat list of all subtopics with their parent topic ID
export const ALL_SUBTOPICS = TOPICS_DATA.flatMap((topic) =>
	topic.subtopics.map((subtopic) => ({
		...subtopic,
		topicId: topic.id,
		topicName: topic.name,
	}))
);

// Create a subtopic map for quick lookup
export const SUBTOPICS_MAP = new Map(
	ALL_SUBTOPICS.map((subtopic) => [subtopic.id, subtopic])
);

export const FORUM_DATA: ForumData = {
	id: 0,
	name: 'Forum',
	subtopics: [
		{id: 1, name: 'doubt'},
		{id: 2, name: 'dream'},
		{id: 3, name: 'need'},
	],
};
