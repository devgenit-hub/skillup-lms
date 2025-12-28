'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit2, ChevronUp, Upload, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { STORAGE_BUCKETS, uploadFile } from '@/lib/supabase/storage';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import CategoryAutocomplete from '@/components/ui/CategoryAutocomplete';
import { useCategoryStore } from '@/lib/zustand/category-store';
import type {
  WebinarSpeaker,
  SessionAgenda,
  WebinarResource,
} from '@/components/props/WebinarProps';
import { useLocale } from '@/providers/locale-provider';

export default function EditWebinarPage() {
  const router = useRouter();
  const params = useParams();
  const webinarId = params.id as string;
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');

  const { addCategory } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    categoryId: null as string | null,
    image: '',
    scheduleDateTime: '',
    duration: '',
    feeType: 'free' as 'free' | 'paid',
    price: '',
    platform: '',
    sessionHighlights: '',
    aboutWebinar: '',
    liveLink: '',
    status: 'draft' as 'draft' | 'upcoming' | 'live' | 'completed',
  });

  const [speakers, setSpeakers] = useState<WebinarSpeaker[]>([
    { name: '', designation: '', image: '' },
  ]);
  const [collapsedSpeakers, setCollapsedSpeakers] = useState<Set<number>>(new Set());

  const [sessionAgenda, setSessionAgenda] = useState<SessionAgenda[]>([
    { time: '', title: '', description: '', speakerName: '' },
  ]);
  const [collapsedAgenda, setCollapsedAgenda] = useState<Set<number>>(new Set());
  const [uploadingResource, setUploadingResource] = useState(false);

  const [resources, setResources] = useState<WebinarResource[]>([]);

  // Fetch webinar data on mount
  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getWebinarById(webinarId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const webinar = response.data as any;

        if (!webinar) {
          toast.error('Webinar not found');
          router.push('/superuser/webinars');
          return;
        }

        // Format datetime for input
        const scheduleDate = new Date(webinar.scheduleDateTime);
        const formattedDateTime = scheduleDate.toISOString().slice(0, 16);

        setFormData({
          title: webinar.title || '',
          category: webinar.category?.title || '',
          categoryId: webinar.categoryId || null,
          image: webinar.image || '',
          scheduleDateTime: formattedDateTime,
          duration: webinar.duration?.toString() || '',
          feeType: webinar.feeType || 'free',
          price: webinar.price?.toString() || '',
          platform: webinar.platform || '',
          sessionHighlights: webinar.sessionHighlights || '',
          aboutWebinar: webinar.aboutWebinar || '',
          liveLink: webinar.liveLink || '',
          status: (webinar.status as 'draft' | 'upcoming' | 'live' | 'completed') || 'draft',
        });

        // Set speakers
        if (webinar.speakers && Array.isArray(webinar.speakers) && webinar.speakers.length > 0) {
          setSpeakers(webinar.speakers as WebinarSpeaker[]);
          // Collapse all speakers with data
          const filledIndices = new Set<number>();
          (webinar.speakers as WebinarSpeaker[]).forEach((s, i) => {
            if (s.name && s.designation) filledIndices.add(i);
          });
          setCollapsedSpeakers(filledIndices);
        }

        // Set session agenda
        if (
          webinar.sessionAgenda &&
          Array.isArray(webinar.sessionAgenda) &&
          webinar.sessionAgenda.length > 0
        ) {
          setSessionAgenda(webinar.sessionAgenda as SessionAgenda[]);
          // Collapse all agenda items with data
          const filledIndices = new Set<number>();
          (webinar.sessionAgenda as SessionAgenda[]).forEach((a, i) => {
            if (a.title && a.time) filledIndices.add(i);
          });
          setCollapsedAgenda(filledIndices);
        }

        // Set resources
        if (webinar.resources && Array.isArray(webinar.resources)) {
          setResources(webinar.resources as WebinarResource[]);
        }
      } catch {
        toast.error('Failed to load webinar');
        router.push('/superuser/webinars');
      } finally {
        setIsLoading(false);
      }
    };

    if (webinarId) {
      fetchWebinar();
    }
  }, [webinarId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Speaker Management
  const addSpeaker = () => {
    const lastIndex = speakers.length - 1;
    const lastSpeaker = speakers[lastIndex];
    if (lastIndex >= 0 && lastSpeaker && isSpeakerFilled(lastSpeaker)) {
      setCollapsedSpeakers((prev) => new Set(prev).add(lastIndex));
    }
    setSpeakers([...speakers, { name: '', designation: '', image: '' }]);
  };

  const toggleSpeakerCollapse = (index: number) => {
    setCollapsedSpeakers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isSpeakerFilled = (speaker: WebinarSpeaker) => {
    return speaker.name && speaker.designation;
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const updateSpeaker = (index: number, field: keyof WebinarSpeaker, value: string) => {
    const updated = [...speakers];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setSpeakers(updated);
  };

  // Session Agenda Management
  const addSessionAgenda = () => {
    const lastIndex = sessionAgenda.length - 1;
    const lastAgenda = sessionAgenda[lastIndex];
    if (lastIndex >= 0 && lastAgenda && isAgendaFilled(lastAgenda)) {
      setCollapsedAgenda((prev) => new Set(prev).add(lastIndex));
    }
    setSessionAgenda([...sessionAgenda, { time: '', title: '', description: '', speakerName: '' }]);
  };

  const toggleAgendaCollapse = (index: number) => {
    setCollapsedAgenda((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isAgendaFilled = (agenda: SessionAgenda) => {
    return agenda.title && agenda.time;
  };

  const removeSessionAgenda = (index: number) => {
    setSessionAgenda(sessionAgenda.filter((_, i) => i !== index));
  };

  const updateSessionAgenda = (index: number, field: keyof SessionAgenda, value: string) => {
    const updated = [...sessionAgenda];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setSessionAgenda(updated);
  };

  // Resource Management
  const addResource = async (file: File) => {
    try {
      setUploadingResource(true);
      const fileUrl = await uploadFile(file, STORAGE_BUCKETS.WEBINARS, 'resources');
      setResources([...resources, { fileName: file.name, fileUrl }]);
      toast.success('Resource uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload resource');
    } finally {
      setUploadingResource(false);
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (
        !formData.title ||
        !formData.category ||
        !formData.scheduleDateTime ||
        !formData.duration ||
        !formData.platform
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.feeType === 'paid' && (!formData.price || parseFloat(formData.price) <= 0)) {
        toast.error('Please enter a valid price for paid webinar');
        return;
      }

      const webinarData = {
        title: formData.title,
        categoryId: formData.categoryId || undefined,
        categoryTitle: !formData.categoryId && formData.category ? formData.category : undefined,
        image: formData.image,
        scheduleDateTime: new Date(formData.scheduleDateTime).toISOString(),
        duration: parseInt(formData.duration),
        feeType: formData.feeType,
        price: formData.feeType === 'paid' ? parseFloat(formData.price) : undefined,
        platform: formData.platform,
        status: formData.status,
        sessionHighlights: formData.sessionHighlights,
        aboutWebinar: formData.aboutWebinar,
        liveLink: formData.liveLink || undefined,
        speakers: speakers.filter((s) => s.name && s.designation),
        sessionAgenda: sessionAgenda.filter((a) => a.title),
        resources: resources.length > 0 ? resources : undefined,
      };

      const response = await apiClient.updateWebinar(webinarId, webinarData);

      // Add new category to store if created
      const result = response.data as { newCategory?: { id: string; title: string; slug: string } };
      if (result?.newCategory) {
        addCategory({ ...result.newCategory, courseCount: 0, webinarCount: 1 });
        toast.success(`Created new category: ${result.newCategory.title}`);
      }

      toast.success('Webinar updated successfully!');
      router.push('/superuser/webinars');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update webinar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-vibrant-blue" />
          <p className="text-slate-600">Loading webinar...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Webinar" description="Update webinar details" />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
      >
        {/* Basic Information Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['basic_information']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['webinar_title']} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., Modern JavaScript Techniques"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['category']} <span className="text-red-500">*</span>
              </label>
              <CategoryAutocomplete
                value={formData.category}
                onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                onCategoryIdChange={(categoryId) =>
                  setFormData((prev) => ({ ...prev, categoryId }))
                }
                placeholder="e.g., Web Development, UI/UX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Platform *</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., Zoom, Facebook Live, YouTube Live"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                bucket={STORAGE_BUCKETS.WEBINARS}
                label={`${formText['webinar_image']} *`}
                variant="hero"
              />
            </div>
          </div>
        </section>

        {/* Schedule & Pricing Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['schedule_pricing']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Schedule Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="scheduleDateTime"
                value={formData.scheduleDateTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., 60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['fee_type']} <span className="text-red-500">*</span>
              </label>
              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="free">{formText['free']}</option>
                <option value="paid">{formText['paid']}</option>
              </select>
            </div>
          </div>

          {formData.feeType === 'paid' && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['price']} (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="৳ ৫০০"
              />
            </div>
          )}

          {/* Live Webinar Link */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Live Webinar Link <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="url"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
              placeholder="https://zoom.us/j/... or https://youtube.com/..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Add the live session link where students can join the webinar
            </p>
          </div>

          {/* Status Selection */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
            >
              <option value="draft">Draft</option>
              <option value="upcoming">Published (Upcoming)</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </section>

        {/* Session Highlights Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['session_highlights']}
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Highlights (Markdown) *
            </label>
            <RichTextEditor
              value={formData.sessionHighlights}
              onChange={(value) => setFormData((prev) => ({ ...prev, sessionHighlights: value }))}
              placeholder="Add key highlights and takeaways..."
              minHeight="150px"
            />
          </div>
        </section>

        {/* About Webinar Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['about_webinar']}
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Webinar Details (Markdown) *
            </label>
            <RichTextEditor
              value={formData.aboutWebinar}
              onChange={(value) => setFormData((prev) => ({ ...prev, aboutWebinar: value }))}
              placeholder="Provide detailed description about the webinar..."
              minHeight="200px"
            />
          </div>
        </section>

        {/* Speakers Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{formText['speakers']}</h2>
            <button
              type="button"
              onClick={addSpeaker}
              className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
            >
              <PlusCircle size={18} />
              {formText['add_speaker']}
            </button>
          </div>

          <div className="space-y-4">
            {speakers.map((speaker, index) => {
              const isCollapsed = collapsedSpeakers.has(index);
              const isFilled = isSpeakerFilled(speaker);

              return (
                <div
                  key={index}
                  className={`p-4 border border-slate-200 rounded-lg transition-all ${
                    isCollapsed ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700">Speaker {index + 1}</h3>
                      {isCollapsed && (
                        <span className="text-xs text-slate-500">- {speaker.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCollapsed && (
                        <button
                          type="button"
                          onClick={() => toggleSpeakerCollapse(index)}
                          className="text-vibrant-blue hover:text-dark-blue transition-colors"
                          title="Edit speaker"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {speakers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpeaker(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={speaker.name}
                            onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Designation *
                          </label>
                          <input
                            type="text"
                            value={speaker.designation}
                            onChange={(e) => updateSpeaker(index, 'designation', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                            placeholder="Senior Developer"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <ImageUpload
                          value={speaker.image}
                          onChange={(url) => updateSpeaker(index, 'image', url)}
                          bucket={STORAGE_BUCKETS.WEBINARS}
                          label="Speaker Image *"
                          variant="avatar"
                        />
                      </div>

                      {isFilled && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => toggleSpeakerCollapse(index)}
                            className="flex items-center gap-2 text-sm text-vibrant-blue hover:text-dark-blue transition-colors"
                          >
                            <ChevronUp size={16} />
                            Collapse Speaker
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Session Agenda Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{formText['session_agenda']}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Optional - Add detailed session timeline
              </p>
            </div>
            <button
              type="button"
              onClick={addSessionAgenda}
              className="flex items-center gap-2 px-4 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
            >
              <PlusCircle size={18} />
              {formText['add_agenda_item']}
            </button>
          </div>

          <div className="space-y-4">
            {sessionAgenda.map((item, index) => {
              const isCollapsed = collapsedAgenda.has(index);
              const isFilled = isAgendaFilled(item);

              return (
                <div
                  key={index}
                  className={`p-4 border border-slate-200 rounded-lg transition-all ${
                    isCollapsed ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700">Agenda Item {index + 1}</h3>
                      {isCollapsed && (
                        <span className="text-xs text-slate-500">- {item.title || item.time}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCollapsed && (
                        <button
                          type="button"
                          onClick={() => toggleAgendaCollapse(index)}
                          className="text-vibrant-blue hover:text-dark-blue transition-colors"
                          title="Edit agenda"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {sessionAgenda.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSessionAgenda(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => updateSessionAgenda(index, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                            placeholder="e.g., 10:00 AM - 10:30 AM"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateSessionAgenda(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                            placeholder="e.g., Introduction & Welcome"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateSessionAgenda(index, 'description', e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white resize-vertical"
                            placeholder="Brief description of this agenda item..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Speaker Name
                          </label>
                          <input
                            type="text"
                            value={item.speakerName}
                            onChange={(e) =>
                              updateSessionAgenda(index, 'speakerName', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                            placeholder="e.g., John Doe"
                          />
                        </div>
                      </div>

                      {isFilled && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => toggleAgendaCollapse(index)}
                            className="flex items-center gap-2 text-sm text-vibrant-blue hover:text-dark-blue transition-colors"
                          >
                            <ChevronUp size={16} />
                            Collapse Agenda
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{formText['resources']}</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload Resource Files (PDF, PPT, etc.)
            </label>
            <div className="relative">
              <input
                type="file"
                id="resourceFile"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    addResource(file);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="resourceFile"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                {uploadingResource ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 mb-2 border-4 border-vibrant-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-600 font-medium">Uploading resource...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-10 h-10 mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">
                      <span className="text-vibrant-blue">Click to upload</span> files
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, PPT, DOC files (MAX. 50MB each)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Resource List */}
            {resources.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Uploaded Resources</h3>
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{resource.fileName}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResource(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push('/superuser/webinars')}
            disabled={isSubmitting}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonText['cancel']}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              'Update Webinar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
