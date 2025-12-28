'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { WebinarFeeType, WebinarStatus } from '@repo/shared';
import Hero from '@/components/webinar-details/sections/Hero';
import MainContent from '@/components/webinar-details/sections/MainContent';
import SideBar from '@/components/webinar-details/sections/SideBar';
import { AboutWebinar } from '@/components/webinar-details/types/AboutCourse';
import { HeroProps } from '@/components/webinar-details/types/HeroProps';
import { Loader2 } from 'lucide-react';

interface WebinarDetails {
  id: string;
  title: string;
  image: string | null;
  category: { id: string; title: string; slug: string } | null;
  scheduleDateTime: string;
  duration: number;
  feeType: 'free' | 'paid';
  price: number | null;
  status: 'upcoming' | 'live' | 'completed';
  platform: string | null;
  sessionHighlights: string | null;
  aboutWebinar: string | null;
  speakers: unknown | null;
  sessionAgenda: unknown | null;
  resources: unknown | null;
  coupons: Array<{ code: string; discount: number; title: string | null }>;
  _count: { registrations: number };
}

export default function WebinarPage() {
  const params = useParams();
  const webinarId = params.webinar_id as string;
  const [webinar, setWebinar] = useState<WebinarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWebinar = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/public/webinars/${webinarId}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Webinar not found');
        }

        const data = await response.json();
        if (isMounted) {
          setWebinar(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load webinar');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (webinarId) {
      fetchWebinar();
    }

    return () => {
      isMounted = false;
    };
  }, [webinarId]);

  const aboutWebinarData: AboutWebinar | null = useMemo(() => {
    if (!webinar) return null;
    return {
      about: webinar.aboutWebinar || '',
      highlights: webinar.sessionHighlights || '',
    };
  }, [webinar]);

  const webinarHeroData: HeroProps | null = useMemo(() => {
    if (!webinar) return null;

    const scheduleDate = new Date(webinar.scheduleDateTime);
    const formattedDate = scheduleDate.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedTime = scheduleDate.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate discounted price if coupons exist
    const maxDiscount = webinar.coupons[0]?.discount || 0;
    const originalPrice = webinar.price || 0;
    const discountedPrice = originalPrice - (originalPrice * maxDiscount) / 100;
    const hasCoupon = webinar.coupons.length > 0 && maxDiscount > 0;

    return {
      title: webinar.title,
      subtitle: webinar.category?.title || 'Webinar',
      sessionDate: formattedDate,
      sessionTime: formattedTime,
      duration: `${webinar.duration} মিনিট`,
      totalRegistered: webinar._count.registrations,
      isLive: webinar.status === WebinarStatus.LIVE,
      isFree: webinar.feeType === WebinarFeeType.FREE,
      price:
        webinar.feeType === WebinarFeeType.PAID && webinar.price
          ? `৳${discountedPrice ? discountedPrice : webinar.price}`
          : 'ফ্রি',
      deletedPrice:
        webinar.feeType === WebinarFeeType.PAID && webinar.price && hasCoupon
          ? `৳${webinar.price}`
          : '',
      videoThumbnail: webinar.image || '/Card/cover.png',
      platform: webinar.platform || 'Zoom',
      coupons: webinar.coupons.map((c) => ({
        code: c.code,
        discount: `${c.discount}%`,
        title: c.title || '',
      })),
      introVideoLink: null,
    };
  }, [webinar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-vibrant-blue mx-auto mb-4" />
          <p className="text-slate-600">Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (error || !webinar || !webinarHeroData || !aboutWebinarData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Webinar Not Found</h1>
          <p className="text-slate-600">
            {error || 'The webinar you are looking for does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero {...webinarHeroData} />
      <div
        id="details"
        className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 relative max-w-7xl"
      >
        <MainContent
          AboutWebinar={aboutWebinarData}
          speakers={
            Array.isArray(webinar.speakers)
              ? (webinar.speakers as { name: string; image: string; designation: string }[])
              : undefined
          }
          sessionAgenda={
            Array.isArray(webinar.sessionAgenda)
              ? (webinar.sessionAgenda as {
                  time: string;
                  title: string;
                  description: string;
                  speakerName?: string;
                }[])
              : undefined
          }
          resources={
            Array.isArray(webinar.resources)
              ? (webinar.resources as { fileUrl: string; fileName: string }[])
              : undefined
          }
        />
        <SideBar AboutWebinar={aboutWebinarData} />
      </div>
    </>
  );
}
