import { Event, EventListItem, EventType, DateRange } from '@/lib/types/event';
import { EventFilters, PaginationInfo } from '@/lib/types/filters';
import { generateMockVenues, getRandomVenue } from './venues.mock';

const eventNames: { name: string; type: EventType; description: string }[] = [
  {
    name: 'Swan Lake',
    type: 'ballet',
    description:
      'Experience the timeless beauty of Tchaikovsky\'s masterpiece. This enchanting ballet tells the story of Odette, a princess turned into a swan by an evil sorcerer\'s curse.',
  },
  {
    name: 'The Nutcracker',
    type: 'ballet',
    description:
      'Journey through a magical winter wonderland in this beloved holiday classic featuring stunning choreography and Tchaikovsky\'s iconic score.',
  },
  {
    name: 'Giselle',
    type: 'ballet',
    description:
      'A romantic ballet in two acts about a peasant girl who dies of a broken heart and becomes one of the Wilis, ghostly spirits of women betrayed.',
  },
  {
    name: 'La Traviata',
    type: 'opera',
    description:
      'Verdi\'s passionate opera about the doomed love between a Parisian courtesan and a young bourgeois. Features beloved arias including "Sempre libera".',
  },
  {
    name: 'Carmen',
    type: 'opera',
    description:
      'Bizet\'s fiery tale of love, jealousy, and tragedy in 19th-century Seville. One of the most performed operas in the world.',
  },
  {
    name: 'The Marriage of Figaro',
    type: 'opera',
    description:
      'Mozart\'s comedic masterpiece about love, intrigue, and forgiveness in the household of Count Almaviva.',
  },
  {
    name: 'Hamlet',
    type: 'theater',
    description:
      'Shakespeare\'s iconic tragedy of the Danish prince torn between duty and morality as he seeks to avenge his father\'s murder.',
  },
  {
    name: 'A Midsummer Night\'s Dream',
    type: 'theater',
    description:
      'Shakespeare\'s magical comedy where fairies, lovers, and amateur actors collide in an enchanted forest.',
  },
  {
    name: 'The Phantom of the Opera',
    type: 'musical',
    description:
      'Andrew Lloyd Webber\'s legendary musical about a masked genius who haunts the Paris Opera House and falls in love with a young soprano.',
  },
  {
    name: 'Les Misérables',
    type: 'musical',
    description:
      'The epic musical adaptation of Victor Hugo\'s novel about love, sacrifice, and redemption in 19th-century France.',
  },
  {
    name: 'Chicago',
    type: 'musical',
    description:
      'The sizzling musical satire of murder, greed, corruption, and all that jazz in Roaring Twenties Chicago.',
  },
  {
    name: 'Wicked',
    type: 'musical',
    description:
      'The untold story of the witches of Oz. Discover what happened before Dorothy dropped in.',
  },
  {
    name: 'Symphony No. 9',
    type: 'concert',
    description:
      'Beethoven\'s triumphant final symphony featuring the famous "Ode to Joy" performed by a full orchestra and chorus.',
  },
  {
    name: 'Piano Concerto No. 2',
    type: 'concert',
    description:
      'Rachmaninoff\'s romantic masterpiece performed by a world-renowned pianist with full orchestra.',
  },
  {
    name: 'Vienna Philharmonic',
    type: 'concert',
    description:
      'An evening of Strauss waltzes and polkas with one of the world\'s most prestigious orchestras.',
  },
  {
    name: 'Alvin Ailey',
    type: 'dance',
    description:
      'Modern dance at its finest from the world-renowned Alvin Ailey American Dance Theater.',
  },
  {
    name: 'Flamenco Festival',
    type: 'dance',
    description:
      'Experience the passion and intensity of authentic Spanish flamenco with world-class performers.',
  },
  {
    name: 'Ballet Gala',
    type: 'ballet',
    description:
      'A spectacular evening featuring principal dancers from the world\'s greatest ballet companies performing iconic pas de deux.',
  },
  {
    name: 'Don Giovanni',
    type: 'opera',
    description:
      'Mozart\'s dramatic opera about the legendary seducer and his ultimate downfall.',
  },
  {
    name: 'Tosca',
    type: 'opera',
    description:
      'Puccini\'s gripping tale of love, political intrigue, and sacrifice in Napoleonic Rome.',
  },
];

function generateDateRange(): DateRange {
  const start = new Date();
  start.setDate(start.getDate() + Math.floor(Math.random() * 30) + 7);
  const end = new Date(start);
  end.setDate(end.getDate() + Math.floor(Math.random() * 28) + 14);
  return { start, end };
}

function generateId(): string {
  return `evt_${Math.random().toString(36).substring(2, 9)}`;
}

let cachedEvents: EventListItem[] | null = null;

export function generateMockEvents(filters?: EventFilters): {
  data: EventListItem[];
  pagination: PaginationInfo;
} {
  if (!cachedEvents) {
    cachedEvents = eventNames.map((event, index) => {
      const venue = getRandomVenue();
      const dateRange = generateDateRange();
      const minPrice = Math.floor(Math.random() * 5000) + 3000;
      const maxPrice = minPrice + Math.floor(Math.random() * 15000) + 5000;

      return {
        id: generateId(),
        name: event.name,
        description: event.description,
        venue: {
          id: venue.id,
          name: venue.name,
          address: venue.address,
        },
        eventType: event.type,
        dateRange,
        thumbnail: `/images/events/${event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
        performanceCount: Math.floor(Math.random() * 15) + 3,
        priceRange: { min: minPrice, max: maxPrice },
        tags: [event.type, 'featured'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }

  let filtered = [...cachedEvents];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search) ||
        e.venue.name.toLowerCase().includes(search)
    );
  }

  if (filters?.eventTypes && filters.eventTypes.length > 0) {
    filtered = filtered.filter((e) => filters.eventTypes!.includes(e.eventType));
  }

  if (filters?.venues && filters.venues.length > 0) {
    filtered = filtered.filter((e) => filters.venues!.includes(e.venue.id));
  }

  const page = 1;
  const pageSize = 20;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data: filtered.slice(0, pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function generateMockEvent(id: string): EventListItem | undefined {
  const { data } = generateMockEvents();
  return data.find((e) => e.id === id);
}

export function getEventById(id: string): EventListItem | undefined {
  return generateMockEvent(id);
}
