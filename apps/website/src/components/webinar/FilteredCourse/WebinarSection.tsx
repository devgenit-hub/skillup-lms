import { WebinarCardProps } from '../types/WebinarCardProps/WebinarCardProps';
import WebinarCard from '../WebinarCard/WebinarCard';
import PaginationSection from './PaginationSection';

const courseData: WebinarCardProps[] = [
  {
    imageUrl: '/Card/cover.png',
    category: 'UI/UX ডিজাইন',
    title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
  },
  {
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
  },
  {
    imageUrl: '/Card/cover.png',
    category: 'ফ্রন্টএন্ড ডেভেলপমেন্ট',
    title: 'ওয়েব ডেভেলপমেন্ট ফান্ডামেন্টালস',
  },
  {
    imageUrl: '/Card/cover.png',
    category: 'ব্যাকএন্ড ডেভেলপমেন্ট',
    title: 'ডাটাবেজ এবং সার্ভার সাইড টেকনোলজিজ',
  },
  {
    imageUrl: '/Card/cover.png',
    category: 'পাইথন প্রোগ্রামিং',
    title: 'পাইথন প্রোগ্রামিং ফান্ডামেন্টালস',
  },
  {
    category: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    title: 'অ্যান্ড্রয়েড অ্যাপ ডেভেলপমেন্ট',
  },
  {
    imageUrl: '/Card/cover.png',
    category: 'ডিজিটাল মার্কেটিং',
    title: 'ডিজিটাল মার্কেটিং মাস্টারক্লাস',
  },
  {
    imageUrl: '/Card/cover.png',
    category: 'ডাটা সায়েন্স',
    title: 'ডাটা সায়েন্স এবং মেশিন লার্নিং',
  },
  {
    category: 'ক্লাউড কম্পিউটিং',
    title: 'এমাজন ওয়েব সার্ভিসেস (AWS) এর সাথে পরিচিতি',
  },
];

export default function WebinarSection() {
  return (
    <section className="w-full flex flex-col items-center gap-12">
      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 space-y-6 w-full">
        {courseData.map((course, idx) => (
          <WebinarCard key={idx} {...course} webinarId={idx} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <PaginationSection />
      </div>
    </section>
  );
}
