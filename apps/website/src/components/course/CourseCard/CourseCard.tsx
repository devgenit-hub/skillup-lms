'use client';
import { usePathname, useRouter } from 'next/navigation';
import { CourseCardProps } from '../types/CourseCardProps/CourseCardProps';
import CourseCardBody from './CourseCardBody';
import CourseCardHeader from './CourseCardHeader';
import CardButton from '@/components/shared/CardButton';

export default function CourseCard(props: CourseCardProps) {
  const router = useRouter();
  const pn = usePathname();
  return (
    <div className="flex flex-col h-full relative rounded-3xl pb-10 bg-card border-black/10 dark:border-white/10 border-2 text-card-foreground shadow-md shadow-black/25">
      <div className="overflow-hidden w-full flex-1 flex flex-col justify-between gap-2 rounded-3xl">
        <CourseCardHeader
          imageUrl={props.imageUrl || '/test_images/course_test.png'}
          title={props.title || 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস'}
          batchNo={props.batchNo || 'ব্যাচ ১'}
          feeType={props.feeType}
          price={props.price}
          maxDiscount={props.maxDiscount?.toString() || null}
        />
        <CourseCardBody
          category={props.category || 'UI/UX ডিজাইন'}
          title={props.title || 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস'}
          studentsEnrolled={props.studentsEnrolled || '৬৫০'}
          totalSessions={props.totalSessions || '২০'}
        />
      </div>
      <div className="absolute left-0 bottom-0 translate-y-1/2 w-full flex justify-center">
        {pn == '/student/mycourse' ? (
          <CardButton
            buttonText="Classroom"
            handleClick={() => {
              router.push(`${props.route}${props.courseId}`);
            }}
          />
        ) : (
          <CardButton
            handleClick={() => {
              router.push(`${props.route}${props.courseId}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
