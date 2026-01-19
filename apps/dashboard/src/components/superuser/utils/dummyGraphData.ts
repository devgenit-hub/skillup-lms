import { MonthlyPurchaseData } from '../PurchaseGraphs';

// Generate last 12 months labels with year
const generateMonths = (): string[] => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const result: string[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthIndex = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    result.push(`${months[monthIndex]} ${year}`);
  }

  return result;
};

// Dummy data for course purchases (last 12 months)
export const coursePurchaseData: MonthlyPurchaseData[] = generateMonths().map((month, index) => ({
  month,
  count: Math.floor(Math.random() * 50) + 10 + index * 2, // Random with slight upward trend
}));

// Dummy data for webinar purchases (last 12 months)
export const webinarPurchaseData: MonthlyPurchaseData[] = generateMonths().map((month, index) => ({
  month,
  count: Math.floor(Math.random() * 30) + 5 + index * 1.5, // Random with slight upward trend
}));

// Dummy courses with enrollment data
export const dummyCourses = [
  {
    id: 'course-1',
    name: 'Complete Web Development Bootcamp',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 40) + 15 + index * 2,
    })),
  },
  {
    id: 'course-2',
    name: 'Advanced React & Next.js',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 35) + 10 + index * 1.8,
    })),
  },
  {
    id: 'course-3',
    name: 'Python for Data Science',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 30) + 12 + index * 1.5,
    })),
  },
  {
    id: 'course-4',
    name: 'Digital Marketing Masterclass',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 45) + 20 + index * 2.5,
    })),
  },
];

// Dummy webinars with enrollment data
export const dummyWebinars = [
  {
    id: 'webinar-1',
    name: 'Introduction to Machine Learning',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 25) + 8 + index * 1.2,
    })),
  },
  {
    id: 'webinar-2',
    name: 'Career Growth in Tech Industry',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 30) + 10 + index * 1.5,
    })),
  },
  {
    id: 'webinar-3',
    name: 'Freelancing Success Stories',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 20) + 5 + index * 1,
    })),
  },
  {
    id: 'webinar-4',
    name: 'Building Your Portfolio',
    enrollmentData: generateMonths().map((month, index) => ({
      month,
      count: Math.floor(Math.random() * 28) + 12 + index * 1.3,
    })),
  },
];
