'use client';
import React, { useState, useEffect } from 'react';
import {
  Video,
  LayoutGrid,
  List,
  Loader2,
  Calendar,
  Clock,
  Users,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';
import Link from 'next/link';

interface WebinarRegistration {
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
    category: { id: string; title: string } | null;
    _count: { registrations: number };
  };
}

function Page() {
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await apiClient.getMyWebinarRegistrations();
        if (response.data?.registrations) {
          setRegistrations(response.data.registrations);
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch webinar registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const isUpcoming = (dateStr: string) => new Date(dateStr) > new Date();

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
          <p className="text-muted-foreground">Loading your webinars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pb-4">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-3 lg:p-5 mb-3 lg:mb-4 transition-all duration-300">
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-2.5 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg">
              <Video className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm lg:text-lg text-gray-800">My Webinars</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {stats.total} registered • {stats.upcoming} upcoming
              </p>
            </div>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center gap-2 justify-between lg:justify-end w-full lg:w-auto">
            {/* <button className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-linear-to-r from-gray-100 to-slate-100 hover:from-purple-500 hover:to-indigo-600 text-gray-700 hover:text-white transition-all duration-300 text-xs lg:text-sm font-medium group flex-1 lg:flex-none justify-center">
              <Filter className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-180 transition-transform duration-300" />
              <span>Filter</span>
            </button> */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setIsGrid(true)}
                className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                  isGrid
                    ? 'bg-white shadow-sm text-purple-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutGrid className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <button
                onClick={() => setIsGrid(false)}
                className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                  !isGrid
                    ? 'bg-white shadow-sm text-purple-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-3 lg:my-4"></div>

      {/* No Webinars Message */}
      {registrations.length === 0 ? (
        <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-8 text-center">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Webinars Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t registered for any webinars yet.
          </p>
          <Link
            href="/webinar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Browse Webinars
          </Link>
        </div>
      ) : (
        <>
          {/* Webinar Grid */}
          {isGrid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 gap-y-6 pb-10">
              {registrations.map((registration, idx) => {
                const upcoming = isUpcoming(registration.webinar.scheduleDateTime);
                return (
                  <div
                    key={registration.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      {/* Image */}
                      <div className="relative h-40 bg-linear-to-br from-purple-500 to-indigo-600">
                        {registration.webinar.image ? (
                          <Image
                            src={registration.webinar.image}
                            alt={registration.webinar.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-16 h-16 text-white/50" />
                          </div>
                        )}
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              upcoming ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                            }`}
                          >
                            {upcoming ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>
                        {/* Category */}
                        {registration.webinar.category && (
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-purple-600">
                              {registration.webinar.category.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors">
                          {registration.webinar.title}
                        </h3>

                        {/* Schedule Info */}
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>
                              {format(
                                new Date(registration.webinar.scheduleDateTime),
                                'MMM dd, yyyy'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>
                              {format(new Date(registration.webinar.scheduleDateTime), 'hh:mm a')} •{' '}
                              {formatDuration(registration.webinar.duration)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{registration.webinar._count.registrations} registered</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {upcoming && registration.webinar.liveLink ? (
                          <a
                            href={registration.webinar.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join Webinar
                          </a>
                        ) : (
                          <button
                            onClick={() =>
                              (window.location.href = `/student/webinar/${registration.webinarId}`)
                            }
                            className="w-full px-4 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {registrations.map((registration, idx) => {
                const upcoming = isUpcoming(registration.webinar.scheduleDateTime);
                return (
                  <div
                    key={registration.id}
                    className="bg-card backdrop-blur-xl rounded-2xl shadow-lg border border-border p-3 lg:p-4 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() =>
                      (window.location.href = `/student/webinar/${registration.webinarId}`)
                    }
                  >
                    <div className="flex gap-3 lg:gap-4">
                      {/* Webinar Image */}
                      <div className="shrink-0 relative">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-linear-to-br from-purple-500 to-indigo-600">
                          {registration.webinar.image ? (
                            <Image
                              src={registration.webinar.image}
                              width={128}
                              height={128}
                              alt={registration.webinar.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-8 h-8 text-white/50" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Webinar Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs lg:text-sm font-medium text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md">
                                {registration.webinar.category?.title || 'General'}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-md ${
                                  upcoming
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {upcoming ? 'Upcoming' : 'Completed'}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm lg:text-base text-foreground line-clamp-2">
                              {registration.webinar.title}
                            </h3>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>
                              {format(
                                new Date(registration.webinar.scheduleDateTime),
                                'MMM dd, yyyy'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>{formatDuration(registration.webinar.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{registration.webinar._count.registrations} registered</span>
                          </div>
                        </div>

                        {/* Join Button for Upcoming */}
                        {upcoming && registration.webinar.liveLink && (
                          <a
                            href={registration.webinar.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Join Webinar
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
