'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentNav from '@/components/student/StudentNav';
import SearchBar from '@/components/student/SearchBar';
import SideBar from '@/components/student/SideBar';
import { Calendar } from '@/components/ui/calendar';
import UpcomingLive from '@/components/student/UpcomingLive';
import MobileMenuButton from '@/components/student/MobileMenuButton';
import MobileSidebar from '@/components/student/MobileSidebar';
import MobileRightPanel from '@/components/student/MobileRightPanel';
import { CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/lib/zustand/auth-store';

interface DashboardContentProps {
  children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  const date = new Date();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isVerified = useAuthStore((state) => state.isVerified);
  const router = useRouter();

  useEffect(() => {
    if (isVerified && !user) {
      router.push('/auth/login');
    }
  }, [user, isVerified, router]);

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-blue"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="mx-auto p-4 lg:p-6 h-screen flex flex-col gap-4 lg:gap-6 max-w-360">
        {/* Top Navigation Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          <div className="lg:col-span-9">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button - Left Sidebar */}
              <MobileMenuButton
                isOpen={isSidebarOpen}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                ariaLabel="Toggle navigation menu"
              />

              <div className="flex-1">
                <StudentNav />
              </div>

              {/* Mobile Menu Button - Right Panel */}
              <button
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className="lg:hidden p-2 rounded-xl bg-card/80 backdrop-blur-xl shadow-md border border-border hover:bg-card transition-all duration-300 active:scale-95"
                aria-label="Toggle calendar and events"
                aria-expanded={isRightPanelOpen}
              >
                <CalendarDays className="w-6 h-6 text-foreground" />
              </button>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-3">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Search Bar - Full width on mobile */}
        <div className="lg:hidden">
          <SearchBar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 min-h-0">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-2 h-full overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin">
              <SideBar />
            </div>
          </aside>

          {/* Main Content - Full width on mobile */}
          <main className="lg:col-span-7 h-full overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin pr-2">{children}</div>
          </main>

          {/* Desktop Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3 h-full overflow-hidden">
            <div className="h-full overflow-y-auto space-y-5 scrollbar-thin">
              <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  className="rounded-2xl w-full"
                  captionLayout="label"
                />
              </div>
              <UpcomingLive />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sidebars */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileRightPanel isOpen={isRightPanelOpen} onClose={() => setIsRightPanelOpen(false)} />
    </div>
  );
}
