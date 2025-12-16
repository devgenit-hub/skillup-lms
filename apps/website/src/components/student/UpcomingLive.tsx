import React from 'react';
import { LiveListProps } from './types/LiveListProps';
import { BellRing, Clock, Video } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';

const liveList: LiveListProps[] = [
  {
    className: 'Class Name',
    typeName: 'Type name',
    liveDate: '24 Oct',
    liveTime: '9.00 am',
    status: 'running',
  },
  {
    className: 'Web Development',
    typeName: 'Development',
    liveDate: '10 Nov',
    liveTime: '9.00 am',
    status: 'pending',
  },
  {
    className: 'BFS Tree',
    typeName: 'Competitive Programming',
    liveDate: '25 Nov',
    liveTime: '9.00 am',
    status: 'pending',
  },
];

export default function UpcomingLive() {
  const { t } = useLocale();
  const pageText = t('student');
  return (
    <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-4 lg:p-5 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600">
            <Video className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm lg:text-base font-bold text-foreground">
            {pageText['live_upcoming']}
          </h1>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {liveList.length} {pageText['sessions_viewAll']}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {liveList.map((live, idx) => (
          <li
            className={`group relative overflow-hidden rounded-2xl bg-linear-to-br transition-all duration-300 cursor-pointer
              ${
                live.status === 'running'
                  ? 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 hover:shadow-lg border border-red-200 dark:border-red-800/50'
                  : 'from-muted/30 to-muted/50 hover:shadow-lg border border-border'
              }`}
            key={idx}
          >
            {/* Status Indicator Bar */}
            {live.status === 'running' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-red-500 to-rose-600 animate-pulse"></div>
            )}

            <div className="flex justify-between items-center p-3 lg:p-4">
              {/* Left Section */}
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`mt-0.5 p-2 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${
                    live.status === 'running'
                      ? 'bg-linear-to-br from-red-500 to-rose-600'
                      : 'bg-linear-to-br from-muted-foreground/60 to-muted-foreground/80'
                  }`}
                >
                  {live.status === 'running' ? (
                    <div className="relative">
                      <Video className="w-3.5 h-3.5 text-white" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
                    </div>
                  ) : (
                    <BellRing className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs lg:text-sm font-bold text-foreground truncate group-hover:text-vibrant-blue transition-colors">
                    {live.className}
                  </h4>
                  <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                    {live.typeName}
                  </p>

                  {live.status === 'running' && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-red-600 font-semibold uppercase">
                        Live Now
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Date & Time */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-px bg-linear-to-b from-transparent via-border to-transparent"></div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <h5 className="text-xs font-bold text-foreground">{live.liveDate}</h5>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{live.liveTime}</p>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-vibrant-blue/0 to-indigo-600/0 group-hover:from-vibrant-blue/5 group-hover:to-indigo-600/5 transition-all duration-300 pointer-events-none"></div>
          </li>
        ))}
      </ul>

      {/* View All Button */}
      <button
        hidden
        className="w-full mt-4 py-2.5 rounded-xl bg-linear-to-r from-muted to-muted/80 hover:from-vibrant-blue hover:to-indigo-600 text-foreground hover:text-white font-medium text-sm transition-all duration-300 hover:shadow-lg group"
      >
        <span className="flex items-center justify-center gap-2">
          View All Sessions
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
}
