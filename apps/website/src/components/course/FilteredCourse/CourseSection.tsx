import { usePathname } from 'next/navigation';
import CourseCard from '../CourseCard/CourseCard';
import { CourseCardProps } from '../types/CourseCardProps/CourseCardProps';
import PaginationSection from './PaginationSection';

const courseData: CourseCardProps[] = [
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ১',
    rating: 4,
    category: 'UI/UX ডিজাইন',
    title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
    studentsEnrolled: '৫২৪',
    totalSessions: '১৬',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ২',
    rating: 4.5,
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
    studentsEnrolled: '৬০০',
    totalSessions: '২০',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৩',
    rating: 3.8,
    category: 'ফ্রন্টএন্ড ডেভেলপমেন্ট',
    title: 'ওয়েব ডেভেলপমেন্ট ফান্ডামেন্টালস',
    studentsEnrolled: '৩৫০',
    totalSessions: '১৮',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৪',
    rating: 4.2,
    category: 'ব্যাকএন্ড ডেভেলপমেন্ট',
    title: 'ডাটাবেজ এবং সার্ভার সাইড টেকনোলজিজ',
    studentsEnrolled: '৪২০',
    totalSessions: '২২',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৫',
    rating: 5,
    category: 'পাইথন প্রোগ্রামিং',
    title: 'পাইথন প্রোগ্রামিং ফান্ডামেন্টালস',
    studentsEnrolled: '৭৫০',
    totalSessions: '২৫',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৬',
    rating: 4.6,
    category: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    title: 'অ্যান্ড্রয়েড অ্যাপ ডেভেলপমেন্ট',
    studentsEnrolled: '৫৮০',
    totalSessions: '১৮',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৭',
    rating: 3.9,
    category: 'ডিজিটাল মার্কেটিং',
    title: 'ডিজিটাল মার্কেটিং মাস্টারক্লাস',
    studentsEnrolled: '৬৫০',
    totalSessions: '২২',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৮',
    rating: 4.7,
    category: 'ডাটা সায়েন্স',
    title: 'ডাটা সায়েন্স এবং মেশিন লার্নিং',
    studentsEnrolled: '৮৫০',
    totalSessions: '৩০',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৯',
    rating: 4.1,
    category: 'ক্লাউড কম্পিউটিং',
    title: 'এমাজন ওয়েব সার্ভিসেস (AWS) এর সাথে পরিচিতি',
    studentsEnrolled: '৪০০',
    totalSessions: '২৪',
  },
];

export default function CourseSection() {
  const pn = usePathname();

  return (
    <section className="w-full flex flex-col items-center gap-12">
      {/* Course Grid */}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          pn !== '/student/allcourse' ? 'lg:grid-cols-3' : ''
        } gap-x-6 gap-y-10 space-y-6 w-full`}
      >
        {courseData.map((course, idx) => (
          <CourseCard key={idx} {...course} courseId={idx} route={'/course/'} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <PaginationSection />
      </div>
    </section>
  );
}
