'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Tag, X, Check } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: string;
  title: string;
  description?: string;
}

interface CourseWebinarData {
  id: string;
  title: string;
  heroImage: string;
  price: number;
  batchNo?: string;
  sessionDate?: string;
  category?: { title: string };
  coupons: Coupon[];
  type: 'course' | 'webinar';
  totalStudents?: number;
  numClasses?: number;
}

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');
  const webinarId = searchParams.get('webinarId');

  const [data, setData] = useState<CourseWebinarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [manualCouponCode, setManualCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        let type: 'course' | 'webinar' = 'course';

        if (courseId) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/public/courses/${courseId}`
          );
          type = 'course';
        } else if (webinarId) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/public/webinars/${webinarId}`
          );
          type = 'webinar';
        } else {
          router.push('/');
          return;
        }

        if (!response.ok) {
          throw new Error('Data not found');
        }

        const result = await response.json();
        const fetchedData = { ...result.data, type };
        setData(fetchedData);

        // Auto-apply maximum discount coupon
        if (fetchedData.coupons && fetchedData.coupons.length > 0) {
          const maxCoupon = fetchedData.coupons.reduce((max: Coupon, coupon: Coupon) => {
            const discount = parseFloat(String(coupon.discount).replace(/[^\d.]/g, '')) || 0;
            const maxDiscount = parseFloat(String(max.discount).replace(/[^\d.]/g, '')) || 0;
            return discount > maxDiscount ? coupon : max;
          });
          setSelectedCoupon(maxCoupon);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, webinarId, router]);

  const calculatedPrice = useMemo(() => {
    if (!data) return { original: 0, discount: 0, final: 0 };

    const original = data.price || 0;
    if (!selectedCoupon) return { original, discount: 0, final: original };

    const discountValue = parseFloat(String(selectedCoupon.discount).replace(/[^\d.]/g, '')) || 0;
    const discount = (original * discountValue) / 100;
    const final = original - discount;

    return { original, discount, final };
  }, [data, selectedCoupon]);

  const handleApplyCoupon = () => {
    if (!data || !manualCouponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError('');

    // Find coupon in available coupons
    const foundCoupon = data.coupons.find(
      (c) => c.code.toLowerCase() === manualCouponCode.trim().toLowerCase()
    );

    setTimeout(() => {
      if (foundCoupon) {
        setSelectedCoupon(foundCoupon);
        setManualCouponCode('');
        setCouponError('');
      } else {
        setCouponError('অবৈধ কুপন কোড');
      }
      setApplyingCoupon(false);
    }, 500);
  };

  const handlePayment = async () => {
    if (!data) return;

    setProcessingPayment(true);
    try {
      const paymentData = {
        amount: Math.round(calculatedPrice.final),
        itemType: data.type,
        itemId: data.id,
        couponCode: selectedCoupon?.code || null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const result = await response.json();

      // Redirect to Uddokta Pay checkout
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('পেমেন্ট শুরু করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-vibrant-blue mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        আপনি প্রিমিয়াম {data.type === 'course' ? 'কোর্সে' : 'ওয়েবিনারে'} প্রবেশাধিকার থেকে মাত্র
        এক মুহূর্ত দূরে আছেন।
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section - Course/Webinar Info */}
        <div className="flex-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">বিস্তারিত</h2>
            <div className="flex gap-4">
              <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={data.heroImage || '/Card/cover.png'}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                {data.batchNo && (
                  <span className="inline-block bg-vibrant-blue text-white px-3 py-1 rounded-full text-sm mb-2">
                    {data.batchNo}
                  </span>
                )}
                {data.sessionDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{data.sessionDate}</p>
                )}
                {data.category && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {data.category.title}
                  </p>
                )}
                {data.totalStudents !== undefined && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {data.totalStudents} জন ছাত্র
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Payment */}
        <div className="flex-1">
          <div className="bg-linear-to-br from-vibrant-blue/10 to-purple-100 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-vibrant-blue/30 sticky top-4">
            <h3 className="text-xl font-bold mb-4">অর্ডারের সারাংশ</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">নিয়মিত মূল্য</span>
                <span className="text-lg font-semibold">
                  ৳{calculatedPrice.original.toLocaleString()}
                </span>
              </div>

              {selectedCoupon && (
                <>
                  <div className="flex justify-between items-center text-vibrant-blue">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      ডিসকাউন্ট ({selectedCoupon.discount} ছাড়)
                    </span>
                    <span className="text-lg font-semibold text-red-500">
                      -৳{Math.round(calculatedPrice.discount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      কুপন: {selectedCoupon.code}
                    </span>
                    <button
                      onClick={() => setSelectedCoupon(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">মোট</span>
                  <span className="text-2xl font-bold text-vibrant-blue">
                    ৳{Math.round(calculatedPrice.final).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Coupon Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">কুপন কোড লিখুন</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCouponCode}
                  onChange={(e) => {
                    setManualCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  placeholder="কুপন কোড"
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-vibrant-blue outline-none"
                  disabled={applyingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!manualCouponCode.trim() || applyingCoupon}
                  className="px-4 py-2 bg-vibrant-blue text-white rounded-lg font-semibold hover:bg-dark-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyingCoupon ? 'প্রয়োগ হচ্ছে...' : 'প্রয়োগ করুন'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
            </div>

            {/* Available Coupons */}
            {data.coupons && data.coupons.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowCoupons(!showCoupons)}
                  className="w-full flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition"
                >
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <Tag className="w-4 h-4 text-vibrant-blue" />
                    উপলব্ধ কুপন ({data.coupons.length})
                  </span>
                  <span className="text-vibrant-blue">{showCoupons ? '▲' : '▼'}</span>
                </button>

                {showCoupons && (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {data.coupons.map((coupon) => (
                      <button
                        key={coupon.id}
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowCoupons(false);
                          setManualCouponCode('');
                        }}
                        className={`w-full text-left p-3 rounded-lg border-2 transition text-sm ${
                          selectedCoupon?.id === coupon.id
                            ? 'border-vibrant-blue bg-vibrant-blue/10'
                            : 'border-gray-200 dark:border-gray-600 hover:border-vibrant-blue/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-vibrant-blue">{coupon.code}</p>
                            <p className="text-xs font-semibold">{coupon.title}</p>
                          </div>
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            {coupon.discount} ছাড়
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="w-full bg-vibrant-blue hover:bg-dark-blue text-white py-3 rounded-full text-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  প্রক্রিয়াকরণ হচ্ছে...
                </>
              ) : (
                'পেমেন্ট সম্পন্ন করুন'
              )}
            </button>

            <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4">
              আপনার বিবরণ Uddokta Pay এর মাধ্যমে নিরাপদে প্রক্রিয়া করা হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
