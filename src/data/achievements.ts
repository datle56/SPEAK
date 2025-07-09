import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Perfect Pronunciation',
    description: 'Score 100% on any lesson',
    icon: '⭐',
    earned: true,
    earnedDate: '2024-01-20'
  },
  {
    id: '2',
    title: 'Week Streak',
    description: 'Practice for 7 days in a row',
    icon: '🔥',
    earned: true,
    earnedDate: '2024-01-22'
  },
  {
    id: '3',
    title: 'Fast Learner',
    description: 'Complete 5 lessons in one day',
    icon: '⚡',
    earned: false
  },
  {
    id: '4',
    title: 'Pronunciation Master',
    description: 'Achieve 90% average accuracy',
    icon: '🎯',
    earned: true,
    earnedDate: '2024-01-18'
  },
  {
    id: '5',
    title: 'Dedicated Student',
    description: 'Study for 30 days total',
    icon: '📚',
    earned: false
  },
  {
    id: '6',
    title: 'Social Learner',
    description: 'Share your progress',
    icon: '🤝',
    earned: false
  }
];