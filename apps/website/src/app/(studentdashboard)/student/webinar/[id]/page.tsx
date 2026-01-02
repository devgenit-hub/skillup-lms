'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Video,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  Loader2,
  BookOpen,
  FileText,
  User,
  CheckCircle,
  Link as LinkIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';

interface Speaker {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
}

interface AgendaItem {
  time?: string;
  title: string;
  description?: string;
}

interface Resource {
  fileName: string;
  fileUrl: string;
  type?: string;
}

interface WebinarDetails {
  id: string;
  webinarId: string;
  userId: string;
  registeredAt: string;
  webinar: {
    id: string;
    title: string;
    image: string | null;
    scheduleDateTime: string;
    duration: number;
    platform: string;
    status: string;
    feeType: string;
    price: number | null;
    liveLink: string | null;
    sessionHighlights: string | null;
    aboutWebinar: string | null;
    speakers: unknown;
    sessionAgenda: unknown;
    resources: unknown;
    category: { id: string; title: string } | null;
    _count: { registrations: number };
  };
}

export default function WebinarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const webinarId = params?.id as string;

  const [registration, setRegistration] = useState<WebinarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebinarDetails = async () => {
      if (!webinarId) return;

      try {
        const response = await apiClient.getMyWebinarDetails(webinarId);
        if (response.data) {
          setRegistration(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch webinar details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load webinar details');
      } finally {
        setLoading(false);
      }
    };

    fetchWebinarDetails();
  }, [webinarId]);

  const isUpcoming = (dateStr: string) => new Date(dateStr) > new Date();
  const isLive = (dateStr: string, duration: number) => {
    const now = new Date();
    const start = new Date(dateStr);
    const end = new Date(start.getTime() + duration * 60000);
    return now >= start && now <= end;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} mins`;
  };

  if (loading) {
    return (
      <div className="h-full pb-4 flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
          <p className="text-muted-foreground">Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="h-full pb-4">
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8 text-center">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {error || 'Webinar not found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            You may not be registered for this webinar or it doesn&apos;t exist.
          </p>
          <Link
            href="/student/mywebinars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Webinars
          </Link>
        </div>
      </div>
    );
  }

  const webinar = registration.webinar;
  const upcoming = isUpcoming(webinar.scheduleDateTime);
  const live = isLive(webinar.scheduleDateTime, webinar.duration);

  // Parse JSON fields safely
  const speakers: Speaker[] = Array.isArray(webinar.speakers) ? webinar.speakers : [];
  const agenda: AgendaItem[] = Array.isArray(webinar.sessionAgenda) ? webinar.sessionAgenda : [];
  const resources: Resource[] = Array.isArray(webinar.resources) ? webinar.resources : [];

  return (
    <div className="h-full pb-4 space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.push('/student/mywebinars')}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Webinars</span>
      </button>

      {/* Header Section with Image */}
      <div className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-48 md:h-64 bg-linear-to-br from-purple-500 to-indigo-600">
          {webinar.image ? (
            <Image src={webinar.image} alt={webinar.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="w-24 h-24 text-white/30" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                live
                  ? 'bg-red-500 text-white animate-pulse'
                  : upcoming
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
              }`}
            >
              {live ? '🔴 Live Now' : upcoming ? 'Upcoming' : 'Completed'}
            </span>
            {webinar.category && (
              <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/90 text-purple-600">
                {webinar.category.title}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{webinar.title}</h1>

          {/* Schedule Info */}
          <div className="flex flex-wrap gap-4 md:gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>{format(new Date(webinar.scheduleDateTime), 'EEEE, MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span>
                {format(new Date(webinar.scheduleDateTime), 'hh:mm a')} •{' '}
                {formatDuration(webinar.duration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>{webinar._count.registrations} registered</span>
            </div>
          </div>

          {/* Join Button - Only show if upcoming/live and has link */}
          {(upcoming || live) && webinar.liveLink && (
            <a
              href={webinar.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all ${
                live
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
              }`}
            >
              <ExternalLink className="w-5 h-5" />
              {live ? 'Join Live Now' : 'Join Webinar'}
            </a>
          )}

          {/* Show link copied message for registered users */}
          {webinar.liveLink && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <LinkIcon className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Live Session Link</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Platform: <span className="font-medium capitalize">{webinar.platform}</span>
                  </p>
                  <a
                    href={webinar.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-500 hover:text-purple-600 break-all mt-1 inline-block"
                  >
                    {webinar.liveLink}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Webinar */}
      {webinar.aboutWebinar && (
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">About This Webinar</h2>
          </div>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: webinar.aboutWebinar }}
          />
        </div>
      )}

      {/* Session Highlights */}
      {webinar.sessionHighlights && (
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Session Highlights</h2>
          </div>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: webinar.sessionHighlights }}
          />
        </div>
      )}

      {/* Speakers */}
      {speakers.length > 0 && (
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Speakers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl border border-border"
              >
                {speaker.image ? (
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">
                      {speaker.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{speaker.name}</h3>
                  {speaker.role && (
                    <p className="text-sm text-purple-500 font-medium">{speaker.role}</p>
                  )}
                  {speaker.bio && (
                    <p className="text-sm text-muted-foreground mt-1">{speaker.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Agenda */}
      {agenda.length > 0 && (
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Session Agenda</h2>
          </div>
          <div className="space-y-3">
            {agenda.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-muted/50 rounded-xl border border-border"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.time && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md">
                        {item.time}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
              <FileText className="w-5 h-5 text-cyan-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Resources & Materials</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  {resource?.fileName && (
                    <p className="font-medium text-foreground truncate">{resource.fileName}</p>
                  )}
                  {resource.type && (
                    <p className="text-xs text-muted-foreground uppercase">{resource.type}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Registration Info */}
      <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Registration Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Registration Date</p>
            <p className="font-semibold text-foreground">
              {format(new Date(registration.registeredAt), 'MMM dd, yyyy hh:mm a')}
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">Fee Type</p>
            <p className="font-semibold text-foreground capitalize">
              {webinar.feeType === 'free'
                ? 'Free'
                : webinar.price
                  ? `৳${webinar.price.toLocaleString()}`
                  : 'Paid'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
