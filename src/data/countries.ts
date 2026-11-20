import type { CountryConfig, Level } from '../types/curriculum';

export const LEVELS: Level[] = ['BASIS', 'KADER', 'MAVO', 'HAVO'];

const EXISTING_COUNTRIES: CountryConfig[] = [
  // ── Singapore ── current / active
  {
    id: 'singapore',
    title: 'Singapore',
    subtitle: 'Asian English & Singlish',
    flag: '🇸🇬',
    region: 'Southeast Asia',
    status: 'current',
    image: 'https://raw.githubusercontent.com/Blaswe02/Singaporehub/main/singaporecity.jpg',
    description:
      'Explore the vibrant Lion City and discover Singlish — a unique English dialect shaped by Malay, Mandarin, and Tamil.',
    dialectFocus: 'Singlish',
    curriculumFocus: [
      'multicultural society',
      'hawker culture',
      'MRT navigation',
      'festivals',
      'identity',
    ],
    recommendedLevels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
    portfolioOutputs: [
      'Write a travel recommendation for Singapore',
      'Compare Singapore and the Netherlands',
      'Explain Singlish with your own examples',
    ],
    teacherNotes:
      'Singapore is the current active module. The Hub app is live on AI Studio. Focus on multicultural identity and Singlish as a world dialect. Use comparison tasks with the Netherlands for MAVO/HAVO.',
    lessons: [
      {
        id: 'sg-hub',
        title: 'Singapore Hub',
        description: 'Introduction to Singapore and its multicultural society',
        type: 'hub',
        skills: ['reading', 'listening', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: 'https://singapore-hub-893488998222.us-west1.run.app',
        icon: '🦁',
        estimatedTime: '45 min',
        output: 'Singapore fact file',
      },
      {
        id: 'sg-intro-gates',
        title: 'Introduction – Bill Gates',
        description: 'Reading & listening about Singapore through a famous visitor',
        type: 'reading',
        skills: ['reading', 'listening', 'vocabulary'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🏙️',
        estimatedTime: '30 min',
        output: 'Reading comprehension answers',
        teacherNote:
          'Good paired reading. Ask HAVO students to identify tone and infer attitude.',
      },
      {
        id: 'sg-hawker',
        title: 'Hawker Culture',
        description: "Vocabulary and culture around Singapore's famous street food scene",
        type: 'culture',
        skills: ['vocabulary', 'culture', 'speaking'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🍜',
        estimatedTime: '30 min',
        output: 'Food vocabulary list + oral recommendation',
        internalLessonId: 'sg-hawker-inline',
      },
      {
        id: 'sg-singlish',
        title: 'Singlish',
        description: 'Understand the unique Singapore English dialect — lah, leh, lor',
        type: 'vocabulary',
        skills: ['vocabulary', 'listening', 'culture'],
        levels: ['KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '💬',
        estimatedTime: '40 min',
        output: 'Singlish phrasebook entry',
        internalLessonId: 'sg-singlish-inline',
      },
      {
        id: 'sg-mrt',
        title: 'Getting Around by MRT',
        description: "Practical English for navigating Singapore's metro system",
        type: 'speaking',
        skills: ['speaking', 'listening', 'vocabulary'],
        levels: ['BASIS', 'KADER'],
        url: '',
        icon: '🚇',
        estimatedTime: '25 min',
        output: 'Dialogue: asking for directions',
        internalLessonId: 'sg-mrt-inline',
      },
      {
        id: 'sg-festivals',
        title: 'Festivals: Chinese New Year, Vesak Day & Deepavali',
        description: 'Multicultural celebrations and their significance in Singapore',
        type: 'culture',
        skills: ['reading', 'vocabulary', 'culture', 'reflection'],
        levels: ['KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🎊',
        estimatedTime: '35 min',
        output: 'Festival comparison paragraph',
      },
      {
        id: 'sg-icons',
        title: 'Icons of Singapore',
        description: 'Marina Bay Sands, Gardens by the Bay, Merlion, Changi Airport',
        type: 'reading',
        skills: ['reading', 'vocabulary', 'writing'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🌆',
        estimatedTime: '30 min',
        output: 'Postcard or tourist guide entry',
      },
      {
        id: 'sg-compare',
        title: 'Singapore vs. the Netherlands',
        description: 'Compare culture, language, food, and society — rank and justify',
        type: 'writing',
        skills: ['writing', 'speaking', 'reflection'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🔍',
        estimatedTime: '45 min',
        output: 'Comparison paragraph or table',
        teacherNote:
          'AI-proof task: students must justify choices with personal reasons, not just facts.',
      },
    ],
  },

  // ── Malta ── completed / archive / prototype
  {
    id: 'malta',
    title: 'Malta',
    subtitle: 'Mediterranean English',
    flag: '🇲🇹',
    region: 'Southern Europe',
    status: 'completed',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Valletta_skyline.jpg/960px-Valletta_skyline.jpg',
    description:
      'Discover the tiny island nation where English has been official for over 200 years, shaped by Maltese, Italian, and British influence.',
    dialectFocus: 'Maltese English',
    curriculumFocus: [
      'island history',
      'Valletta',
      'Knights of Malta',
      'Mediterranean food',
      'identity',
      'tourism vs Netherlands',
    ],
    recommendedLevels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
    portfolioOutputs: [
      'Write a tourist guide for Valletta',
      'Compare Malta and the Netherlands',
      'Explain what makes Maltese English unique',
    ],
    teacherNotes:
      'Malta is the prototype/archive module — the first completed module. Show students what a finished module looks like. Good reference for Singapore comparison tasks.',
    lessons: [
      {
        id: 'mt-intro',
        title: 'Malta Introduction',
        description: 'Geography, history and culture of Malta',
        type: 'hub',
        skills: ['reading', 'listening', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '⛵',
        estimatedTime: '40 min',
        output: 'Malta fact file',
      },
      {
        id: 'mt-valletta',
        title: 'Valletta: Capital City',
        description: "Explore Europe's smallest capital and its UNESCO heritage",
        type: 'reading',
        skills: ['reading', 'vocabulary', 'culture'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🏛️',
        estimatedTime: '35 min',
        output: 'Reading comprehension + travel recommendation',
      },
      {
        id: 'mt-food',
        title: 'Maltese Food & Language',
        description: 'Food vocabulary and how Maltese English differs from British English',
        type: 'vocabulary',
        skills: ['vocabulary', 'speaking', 'culture'],
        levels: ['BASIS', 'KADER'],
        url: '',
        icon: '🥘',
        estimatedTime: '30 min',
        output: 'Food vocabulary quiz + recommendation',
      },
      {
        id: 'mt-history',
        title: 'Knights & History',
        description: "Reading comprehension about Malta's fascinating history and identity",
        type: 'reading',
        skills: ['reading', 'culture', 'reflection'],
        levels: ['HAVO'],
        url: '',
        icon: '⚔️',
        estimatedTime: '45 min',
        output: 'Historical analysis paragraph',
        teacherNote: 'HAVO only. Requires inference and historical reasoning.',
      },
      {
        id: 'mt-festivals',
        title: 'Maltese Festivals',
        description: 'Religious and cultural celebrations unique to Malta',
        type: 'culture',
        skills: ['reading', 'vocabulary', 'culture'],
        levels: ['KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🎆',
        estimatedTime: '30 min',
        output: 'Festival description',
      },
      {
        id: 'mt-compare',
        title: 'Malta vs. the Netherlands',
        description: 'Compare two European countries with very different English traditions',
        type: 'writing',
        skills: ['writing', 'speaking', 'reflection'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🔍',
        estimatedTime: '40 min',
        output: 'Comparison table or paragraph',
      },
    ],
  },

  // ── Hawaii ── development / upcoming
  {
    id: 'hawaii',
    title: 'Hawaii',
    subtitle: 'Pacific English & Hawaiian Culture',
    flag: '🇺🇸',
    region: 'Pacific Ocean',
    status: 'development',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Na_Pali_Coast.jpg/960px-Na_Pali_Coast.jpg',
    description:
      'Journey to the 50th US state, where American English blends with Hawaiian Pidgin and the rich culture of the Pacific islands.',
    dialectFocus: 'Hawaiian Pidgin English',
    curriculumFocus: [
      'aloha spirit',
      'nature & volcanoes',
      'Pearl Harbor',
      'hula',
      'Hawaiian food',
      'tourism vs. respect',
      'heritage trail',
    ],
    recommendedLevels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
    portfolioOutputs: [
      'Design a heritage trail for visitors to Hawaii',
      'Write a reflection: tourism vs. respect for Hawaiian culture',
      'Create a food guide using Hawaiian Pidgin vocabulary',
    ],
    teacherNotes:
      'Hawaii has more narrative/game elements: a spirit animal companion, board game and heritage trail are planned. Good for nature vocabulary, cultural respect, and identity themes.',
    lessons: [
      {
        id: 'hi-intro',
        title: 'Aloha Hawaii',
        description: 'Introduction to Hawaii and the spirit of aloha',
        type: 'hub',
        skills: ['reading', 'listening', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🌺',
        estimatedTime: '40 min',
        output: 'Hawaii fact file',
      },
      {
        id: 'hi-volcano',
        title: 'Volcanoes & Nature',
        description:
          "Science vocabulary through Hawaii's dramatic landscape — Mauna Kea & Na Pali Coast",
        type: 'vocabulary',
        skills: ['vocabulary', 'reading', 'culture'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🌋',
        estimatedTime: '35 min',
        output: 'Nature vocabulary quiz + paragraph',
      },
      {
        id: 'hi-surf',
        title: 'Surf Culture & Duke Kahanamoku',
        description: 'The language of surfing — from Hawaii to the world',
        type: 'culture',
        skills: ['vocabulary', 'speaking', 'culture'],
        levels: ['BASIS', 'KADER'],
        url: '',
        icon: '🏄',
        estimatedTime: '30 min',
        output: 'Surf vocabulary + short oral recommendation',
      },
      {
        id: 'hi-hula',
        title: 'Hula & Traditions',
        description: 'Culture and storytelling through traditional Hawaiian dance',
        type: 'culture',
        skills: ['listening', 'vocabulary', 'culture', 'reflection'],
        levels: ['KADER', 'MAVO'],
        url: '',
        icon: '🌴',
        estimatedTime: '35 min',
        output: 'Cultural reflection paragraph',
      },
      {
        id: 'hi-pearlharbor',
        title: 'Pearl Harbor',
        description: 'History and memory — a turning point in World War II',
        type: 'reading',
        skills: ['reading', 'vocabulary', 'culture', 'reflection'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '⚓',
        estimatedTime: '45 min',
        output: 'Historical reflection paragraph',
      },
      {
        id: 'hi-food',
        title: 'Hawaiian Food Culture',
        description: 'Poke, loco moco, kalua pig, spam musubi — food vocabulary and culture',
        type: 'vocabulary',
        skills: ['vocabulary', 'speaking', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO'],
        url: '',
        icon: '🍱',
        estimatedTime: '30 min',
        output: 'Food recommendation + mini menu',
      },
      {
        id: 'hi-heritage',
        title: 'Heritage Trail',
        description:
          'Follow the spirit companion through Hawaiian history and culture checkpoints',
        type: 'game',
        skills: ['reading', 'speaking', 'culture', 'reflection'],
        levels: ['KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🗺️',
        estimatedTime: '60 min',
        output: 'Heritage trail portfolio stamp',
      },
    ],
  },

  // ── Jamaica ── locked / upcoming
  {
    id: 'jamaica',
    title: 'Jamaica',
    subtitle: 'Caribbean English & Patois',
    flag: '🇯🇲',
    region: 'Caribbean',
    status: 'locked',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Negril-Beach.jpg/960px-Negril-Beach.jpg',
    description:
      'Explore the birthplace of reggae and patois — a vibrant Caribbean English dialect full of rhythm and cultural heritage.',
    dialectFocus: 'Jamaican Patois',
    curriculumFocus: ['reggae', 'Bob Marley', 'Patois', 'jerk food', 'sports & music', 'nature'],
    recommendedLevels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
    portfolioOutputs: [
      'Write a music review using Jamaican vocabulary',
      'Compare Jamaican Patois with Standard English',
      'Design a "Visit Jamaica" poster',
    ],
    teacherNotes:
      'Jamaica is a strong intro week or culture lesson module. Works well for music and identity themes. Patois comparison tasks are effective at MAVO/HAVO.',
    lessons: [
      {
        id: 'jm-intro',
        title: 'Jamaica Introduction',
        description: 'Island culture, history and Jamaican Patois basics',
        type: 'hub',
        skills: ['reading', 'listening', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🎵',
        estimatedTime: '40 min',
        output: 'Jamaica fact file',
      },
      {
        id: 'jm-reggae',
        title: 'Reggae & Bob Marley',
        description: "Music, lyrics and Jamaica's cultural impact on global English",
        type: 'culture',
        skills: ['listening', 'vocabulary', 'culture', 'reflection'],
        levels: ['KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🎶',
        estimatedTime: '40 min',
        output: 'Lyrics analysis + personal response',
      },
      {
        id: 'jm-patois',
        title: 'Jamaican Patois',
        description: 'Understanding the unique Creole language of Jamaica',
        type: 'vocabulary',
        skills: ['vocabulary', 'listening', 'culture'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '💬',
        estimatedTime: '35 min',
        output: 'Patois phrasebook entry',
      },
      {
        id: 'jm-food',
        title: 'Jerk & Food Culture',
        description: 'Vocabulary through the vibrant flavors of Jamaican cuisine',
        type: 'vocabulary',
        skills: ['vocabulary', 'speaking', 'culture'],
        levels: ['BASIS', 'KADER'],
        url: '',
        icon: '🌶️',
        estimatedTime: '30 min',
        output: 'Food recommendation',
      },
    ],
  },

  // ── Ireland ── locked / upcoming
  {
    id: 'ireland',
    title: 'Ireland',
    subtitle: 'Celtic English & Hiberno-English',
    flag: '🇮🇪',
    region: 'Northern Europe',
    status: 'locked',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/TheCliffs_of_Moher.jpg/960px-TheCliffs_of_Moher.jpg',
    description:
      'Discover the Emerald Isle where Irish English (Hiberno-English) carries the rhythm of the Gaelic language and centuries of unique history.',
    dialectFocus: 'Hiberno-English',
    curriculumFocus: ['Dublin', 'Gaelic heritage', 'Irish myths', 'literature', 'history', 'nature'],
    recommendedLevels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
    portfolioOutputs: [
      'Write an Irish folk story opening',
      'Compare Irish English with American English',
      'Design a Dublin day trip',
    ],
    teacherNotes:
      'Ireland has an existing older module. Reuse quiz/game structures. Good for myths, literature and dialect themes. The Leprechaun Quest works well for lower levels.',
    lessons: [
      {
        id: 'ie-intro',
        title: 'Ireland Introduction',
        description: 'History, culture and the Irish accent',
        type: 'hub',
        skills: ['reading', 'listening', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO', 'HAVO'],
        url: '',
        icon: '🍀',
        estimatedTime: '40 min',
        output: 'Ireland fact file',
      },
      {
        id: 'ie-dublin',
        title: 'Dublin City',
        description: "Explore Ireland's literary capital and its English heritage",
        type: 'reading',
        skills: ['reading', 'vocabulary', 'culture'],
        levels: ['MAVO', 'HAVO'],
        url: '',
        icon: '🏙️',
        estimatedTime: '35 min',
        output: 'City guide entry',
      },
      {
        id: 'ie-myths',
        title: 'Myths & Legends',
        description: 'Irish folklore, leprechauns, and Celtic mythology',
        type: 'culture',
        skills: ['reading', 'vocabulary', 'culture'],
        levels: ['BASIS', 'KADER', 'MAVO'],
        url: '',
        icon: '🌈',
        estimatedTime: '35 min',
        output: 'Myth retelling or legend summary',
      },
    ],
  },

];


/** School route: the order within each year is the period order. */
export const DESTINATION_YEARS = [
  {
    "year": 1,
    "destinations": [
      {
        "id": "uk",
        "title": "UK",
        "subtitle": "British English",
        "region": "Europe",
        "flag": "🇬🇧",
        "code": "LHR",
        "period": 1
      },
      {
        "id": "australia",
        "title": "Australia",
        "subtitle": "Australian English",
        "region": "Oceania",
        "flag": "🇦🇺",
        "code": "SYD",
        "period": 2
      },
      {
        "id": "canada",
        "title": "Canada",
        "subtitle": "Canadian English",
        "region": "North America",
        "flag": "🇨🇦",
        "code": "YVR",
        "period": 3
      },
      {
        "id": "usa",
        "title": "USA",
        "subtitle": "American English",
        "region": "North America",
        "flag": "🇺🇸",
        "code": "USA",
        "period": 4
      }
    ]
  },
  {
    "year": 2,
    "destinations": [
      {
        "id": "india",
        "title": "India",
        "subtitle": "English across India",
        "region": "South Asia",
        "flag": "🇮🇳",
        "code": "DEL",
        "period": 1
      },
      {
        "id": "ireland",
        "title": "Ireland",
        "subtitle": "Hiberno-English",
        "region": "Europe",
        "flag": "🇮🇪",
        "code": "DUB",
        "period": 2
      },
      {
        "id": "south-africa",
        "title": "South Africa",
        "subtitle": "South African English",
        "region": "Southern Africa",
        "flag": "🇿🇦",
        "code": "CPT",
        "period": 3
      },
      {
        "id": "new-zealand",
        "title": "New Zealand",
        "subtitle": "New Zealand English",
        "region": "Oceania",
        "flag": "🇳🇿",
        "code": "AKL",
        "period": 4
      }
    ]
  },
  {
    "year": 3,
    "destinations": [
      {
        "id": "jamaica",
        "title": "Jamaica",
        "subtitle": "Caribbean English & Patois",
        "region": "Caribbean",
        "flag": "🇯🇲",
        "code": "KIN",
        "period": 1
      },
      {
        "id": "malta",
        "title": "Malta",
        "subtitle": "Mediterranean English",
        "region": "Southern Europe",
        "flag": "🇲🇹",
        "code": "MLA",
        "period": 2
      },
      {
        "id": "singapore",
        "title": "Singapore",
        "subtitle": "Asian English & Singlish",
        "region": "Southeast Asia",
        "flag": "🇸🇬",
        "code": "SIN",
        "period": 3
      },
      {
        "id": "hawaii",
        "title": "Hawaii",
        "subtitle": "Pacific English & Hawaiian Culture",
        "region": "Pacific Ocean",
        "flag": "🇺🇸",
        "code": "HNL",
        "period": 4
      }
    ]
  },
  {
    "year": 4,
    "destinations": [
      {
        "id": "new-york",
        "title": "New York",
        "subtitle": "City stories & American English",
        "region": "USA · New York",
        "flag": "🇺🇸",
        "code": "NYC",
        "period": 1
      },
      {
        "id": "texas",
        "title": "Texas",
        "subtitle": "The First Miles",
        "region": "USA · Texas",
        "flag": "🇺🇸",
        "code": "TEX",
        "period": 2
      },
      {
        "id": "california",
        "title": "California",
        "subtitle": "West Coast stories & English",
        "region": "USA · California",
        "flag": "🇺🇸",
        "code": "CAL",
        "period": 3
      }
    ]
  }
] as const;

export function getDestinationYear(id: string): number {
  return DESTINATION_YEARS.find(group => group.destinations.some(destination => destination.id === id))?.year ?? 1;
}

export function getDestinationPeriod(id: string): number {
  for (const group of DESTINATION_YEARS) {
    const destination = group.destinations.find(destination => destination.id === id);
    if (destination) return destination.period;
  }
  return 1;
}

export function getDestinationCode(id: string): string {
  for (const group of DESTINATION_YEARS) {
    const destination = group.destinations.find(destination => destination.id === id);
    if (destination) return destination.code;
  }
  return '';
}

export const COUNTRIES: CountryConfig[] = DESTINATION_YEARS.flatMap(group =>
  group.destinations.map(destination => {
    const existing = EXISTING_COUNTRIES.find(country => country.id === destination.id);
    if (existing) return { ...existing, image: '/destinations/' + destination.id + '.jpg' };
    return {
      id: destination.id,
      title: destination.title,
      subtitle: destination.subtitle,
      flag: destination.flag,
      region: destination.region,
      status: 'locked' as const,
      image: '/destinations/' + destination.id + '.jpg',
      description: `Explore ${destination.title} through English, culture and stories. Your teacher will add and open the lessons for this destination.`,
      dialectFocus: destination.subtitle,
      curriculumFocus: [],
      recommendedLevels: group.year === 4 ? ['BASIS', 'KADER', 'MAVO'] as Level[] : [...LEVELS],
      lessons: [],
      portfolioOutputs: [],
    };
  })
);
