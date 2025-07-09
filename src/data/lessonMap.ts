import { LessonNode } from '../types';

export const lessonNodes: LessonNode[] = [
  {
    id: 1,
    title: 'Greetings',
    icon: '👋',
    status: 'perfect',
    stars: 3,
    position: { x: 50, y: 5 },
    category: 'Basic'
  },
  {
    id: 2,
    title: 'Numbers',
    icon: '🔢',
    status: 'completed',
    stars: 2,
    position: { x: 25, y: 15 },
    category: 'Basic'
  },
  {
    id: 3,
    title: 'Family',
    icon: '👨‍👩‍👧‍👦',
    status: 'current',
    stars: 0,
    position: { x: 75, y: 25 },
    category: 'Basic'
  },
  {
    id: 4,
    title: 'Colors',
    icon: '🌈',
    status: 'available',
    stars: 0,
    position: { x: 30, y: 35 },
    category: 'Vocabulary'
  },
  {
    id: 5,
    title: 'Food',
    icon: '🍎',
    status: 'available',
    stars: 0,
    position: { x: 70, y: 45 },
    category: 'Vocabulary'
  },
  {
    id: 6,
    title: 'Animals',
    icon: '🐱',
    status: 'locked',
    stars: 0,
    position: { x: 35, y: 55 },
    category: 'Vocabulary'
  },
  {
    id: 7,
    title: 'Home',
    icon: '🏠',
    status: 'locked',
    stars: 0,
    position: { x: 65, y: 65 },
    category: 'Vocabulary'
  },
  {
    id: 8,
    title: 'Weather',
    icon: '🌤️',
    status: 'locked',
    stars: 0,
    position: { x: 40, y: 75 },
    category: 'Advanced'
  },
  {
    id: 9,
    title: 'Travel',
    icon: '✈️',
    status: 'locked',
    stars: 0,
    position: { x: 60, y: 85 },
    category: 'Advanced'
  },
  {
    id: 10,
    title: 'Business',
    icon: '💼',
    status: 'locked',
    stars: 0,
    position: { x: 45, y: 95 },
    category: 'Advanced'
  }
];