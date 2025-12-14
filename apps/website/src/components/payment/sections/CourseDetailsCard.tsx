import Image from 'next/image';
import Rating from '@mui/material/Rating';
import { CourseDetailsProps } from '../types/CourseDetailsProps';
import { FiBook } from 'react-icons/fi';

export default function CourseDetailsCard({
  imageUrl,
  batchNo,
  rating,
  totalReviews,
  title,
}: CourseDetailsProps) {
  return (
    <div className="bg-dark-blue/10 border border-dark-blue p-4 rounded-3xl shadow-md text-foreground text-sm">
      <p className="mb-3 text-sm leading-relaxed text-justify-center text-foreground/50">
        আপনার কোর্সের বিবরণ পর্যালোচনা করুন এবং তালিকাভুক্তি সম্পন্ন করার জন্য আপনার পছন্দের পেমেন্ট
        গেটওয়ে নির্বাচন করুন। আপনার কাছে কোনো প্রোমো বা অ্যাফিলিয়েট কোড থাকলে, নিচে প্রয়োগ করুন।
        সমস্ত পেমেন্ট SSLCommerz এবং Stripe এর মাধ্যমে ১০০% সুরক্ষিত।
      </p>

      <div className="h-px w-full bg-foreground/40 mb-2"> </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">অর্ডারের বিষয়বস্তু</h2>
        <div className="flex items-center gap-3 space-x-4">
          <Image
            src={imageUrl}
            alt="Course"
            width={96}
            height={64}
            className="object-cover rounded-xl"
          />
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="relative h-[44px] w-[95px]">
                <svg
                  viewBox="0 0 95 44"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full scale-70 origin-center"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M84.5322 17.3154C84.4871 17.4294 84.4852 17.5568 84.5273 17.6719L90.7356 34.6567C90.974 35.3091 90.491 36 89.7963 36H5.59375C5.04147 36 4.59375 35.5523 4.59375 35V1C4.59375 0.447716 5.04147 0 5.59375 0H89.9307C90.6369 0 91.1206 0.712347 90.8601 1.36884L84.5322 17.3154Z"
                    fill="#E7000B"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold px-2 text-xs">
                  {batchNo}
                </div>
              </div>

              <Rating
                name="half-rating-read"
                defaultValue={rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  '& .MuiRating-iconEmpty': {
                    color: 'gold',
                  },
                }}
              />
              <span className="text-foreground text-sm">
                <span className="font-bold">{rating}</span> ({totalReviews})
              </span>
            </div>
            <p className="text-sm flex gap-1 items-center font-bold">
              <FiBook /> ১৬টি+ সেশন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
