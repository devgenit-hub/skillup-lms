'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState } from 'react';
import { PlusCircle, Trash2, Upload, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type {
  WebinarSpeaker,
  SessionAgenda,
  WebinarResource,
} from '@/components/props/WebinarProps';
import { useLocale } from '@/providers/locale-provider';

export default function CreateWebinarPage() {
  const { t } = useLocale();
  const formText = t('forms');
  const buttonText = t('buttons');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    scheduleDateTime: '',
    duration: '',
    feeType: 'free' as 'free' | 'paid',
    price: '',
    platform: '',
    sessionHighlights: '',
    aboutWebinar: '',
  });

  const [speakers, setSpeakers] = useState<WebinarSpeaker[]>([
    { name: '', designation: '', image: '' },
  ]);

  const [sessionAgenda, setSessionAgenda] = useState<SessionAgenda[]>([
    { time: '', title: '', description: '', speakerName: '' },
  ]);

  const [resources, setResources] = useState<WebinarResource[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Speaker Management
  const addSpeaker = () => {
    setSpeakers([...speakers, { name: '', designation: '', image: '' }]);
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
    setSessionAgenda([...sessionAgenda, { time: '', title: '', description: '', speakerName: '' }]);
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
  const addResource = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setResources([...resources, { fileName: file.name, fileUrl }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const webinarData = {
      ...formData,
      duration: parseInt(formData.duration),
      price: formData.feeType === 'paid' ? parseFloat(formData.price) : undefined,
      speakers: speakers.filter((speaker) => speaker.name && speaker.designation && speaker.image),
      sessionAgenda: sessionAgenda.filter((item) => item.time && item.title && item.description),
      resources,
    };

    console.log('Webinar Data:', webinarData);
    alert('Webinar created successfully! Check console for data.');
  };

  return (
    <div>
      <PageHeader
        title={formText['create_webinar_title']}
        description={formText['create_webinar_subtitle']}
      />

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

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent"
                placeholder="e.g., Web Development, Ui/UX"
              />
              <select
                hidden
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="webdev">Web Development</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobiledev">Mobile Development</option>
                <option value="devOps">DevOps</option>
                <option value="ui-ux">UI/UX</option>
                <option value="others">Others</option>
              </select>
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

              <select
                hidden
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
              >
                <option value="zoom">Zoom</option>
                <option value="facebook">Facebook Live</option>
                <option value="youtube">YouTube Live</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {formText['webinar_image']} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="webinarImage"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, image: imageUrl }));
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="webinarImage"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  {formData.image ? (
                    <div className="relative w-full h-full">
                      <img
                        src={formData.image}
                        alt="Webinar preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 hover:opacity-100 font-medium">
                          Click to change image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-600 font-medium">
                        <span className="text-vibrant-blue">Click to upload</span>
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      <p className="text-sm text-rose-500 font-bold mt-1">
                        Recommended aspect ratio: 16:9
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule & Pricing Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {formText['schedule_pricing']}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule-date" className="text-sm font-semibold text-slate-700">
                Schedule Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="schedule-date"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.scheduleDateTime && 'text-slate-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduleDateTime ? (
                      format(new Date(formData.scheduleDateTime), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.scheduleDateTime ? new Date(formData.scheduleDateTime) : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const currentTime = formData.scheduleDateTime.split('T')[1] || '00:00';
                        setFormData((prev) => ({
                          ...prev,
                          scheduleDateTime: `${format(date, 'yyyy-MM-dd')}T${currentTime}`,
                        }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule-time" className="text-sm font-semibold text-slate-700">
                Schedule Time *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formData.scheduleDateTime.split('T')[1]?.split(':')[0] || ''}
                  onValueChange={(hour) => {
                    const currentDate =
                      formData.scheduleDateTime.split('T')[0] || format(new Date(), 'yyyy-MM-dd');
                    const currentMinute =
                      formData.scheduleDateTime.split('T')[1]?.split(':')[1] || '00';
                    setFormData((prev) => ({
                      ...prev,
                      scheduleDateTime: `${currentDate}T${hour}:${currentMinute}`,
                    }));
                  }}
                >
                  <SelectTrigger id="schedule-time">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      const period = i < 12 ? 'AM' : 'PM';
                      const displayHour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                      return (
                        <SelectItem key={hour} value={hour}>
                          {displayHour} {period}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.scheduleDateTime.split('T')[1]?.split(':')[1] || ''}
                  onValueChange={(minute) => {
                    const currentDate =
                      formData.scheduleDateTime.split('T')[0] || format(new Date(), 'yyyy-MM-dd');
                    const currentHour =
                      formData.scheduleDateTime.split('T')[1]?.split(':')[0] || '00';
                    setFormData((prev) => ({
                      ...prev,
                      scheduleDateTime: `${currentDate}T${currentHour}:${minute}`,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => {
                      const minute = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
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

            {formData.feeType === 'paid' && (
              <div>
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
            <textarea
              name="sessionHighlights"
              value={formData.sessionHighlights}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
              placeholder="Use markdown list format:&#10;- Key takeaway 1&#10;- Key takeaway 2&#10;- Key takeaway 3"
            />
            <p className="mt-1 text-xs text-slate-500">
              Use markdown list format for structured highlights
            </p>
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
            <textarea
              name="aboutWebinar"
              value={formData.aboutWebinar}
              onChange={handleInputChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent resize-vertical"
              placeholder="Provide detailed description about the webinar using markdown formatting...&#10;&#10;## What You'll Learn&#10;- Topic 1&#10;- Topic 2&#10;&#10;## Who Should Attend&#10;Description here..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Supports Markdown formatting (e.g., **bold**, *italic*, headers, lists)
            </p>
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
            {speakers.map((speaker, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Speaker {index + 1}</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
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

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Image *</label>
                    <div className="relative">
                      <input
                        type="file"
                        id={`speakerImage-${index}`}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            updateSpeaker(index, 'image', imageUrl);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`speakerImage-${index}`}
                        className="flex items-center justify-center w-full px-3 py-2 border border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                      >
                        {speaker.image ? (
                          <div className="flex items-center gap-2 w-full">
                            <img
                              src={speaker.image}
                              alt="Preview"
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-sm text-slate-600 truncate flex-1">
                              Image selected
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Upload size={16} />
                            <span>Choose image</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Session Agenda Section (Optional) */}
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
            {sessionAgenda.map((item, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Agenda Item {index + 1}</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateSessionAgenda(index, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                      placeholder="e.g., 10:00 AM - 10:30 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
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
                      onChange={(e) => updateSessionAgenda(index, 'description', e.target.value)}
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
                      onChange={(e) => updateSessionAgenda(index, 'speakerName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent bg-white"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
              </div>
            ))}
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
                    e.target.value = ''; // Reset input
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="resourceFile"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-10 h-10 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600 font-medium">
                    <span className="text-vibrant-blue">Click to upload</span> files
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, PPT, DOC files (MAX. 10MB each)
                  </p>
                </div>
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
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {buttonText['cancel']}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-dark-blue text-white rounded-lg hover:bg-vibrant-blue transition-colors font-medium"
          >
            {formText['create_webinar']}
          </button>
        </div>
      </form>
    </div>
  );
}
