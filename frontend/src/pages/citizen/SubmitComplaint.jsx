import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import VoiceInputButton from '../../components/common/VoiceInputButton';
import LocationPicker from '../../components/common/LocationPicker';
import { Sparkles, Upload, X, Send, ShieldCheck, Building2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const SubmitComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // AI Live Classification State
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Trigger Gemini AI classification
  const analyzeWithAI = async () => {
    if (!title || !description) {
      showError("Please fill in both title and description to run AI classification.");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.post('/ai/classify', { title, description });
      if (res.status === 'success') {
        setAiResult(res.data);
        showSuccess("Gemini AI analyzed your issue successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Process files
  const processFiles = (selectedFiles) => {
    if (selectedFiles.length + images.length > 4) {
      showError("You can upload a maximum of 4 image attachments.");
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Image upload handling
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      } else {
        showError("Please upload valid image files only.");
      }
    }
  };

  const removeImage = (index) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    const nextPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(nextPreviews);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showError("Title and description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location || 'City Central');
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);

      images.forEach((img) => {
        formData.append('images[]', img);
      });

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 'success') {
        showSuccess("Complaint submitted and routed to department successfully!");
        navigate(`/complaints/${res.data.complaint_id}`);
      }
    } catch (err) {
      showError(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <PageHeader
        title="Submit Citizen Complaint"
        subtitle="Describe your civic issue. Gemini AI auto-classifies category, priority, and assigns the responsible department officer."
        breadcrumbs={[{ label: 'Submit Complaint' }]}
      />

      <div className="grid md:grid-cols-3 gap-6">

        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <Card hoverEffect={false} className="p-6 sm:p-8 space-y-6">

            {/* Complaint Title */}
            <FormInput
              label="Complaint Subject / Title"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large 2-foot deep pothole near Metro Gate 3"
              required
            />

            {/* Description & Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <VoiceInputButton onTranscript={(text) => setDescription((prev) => (prev ? prev + ' ' + text : text))} />
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, street details, duration, and safety concerns..."
                required
                className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* AI Trigger Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={analyzeWithAI}
                loading={analyzing}
                disabled={!title || !description}
                icon={Sparkles}
              >
                Run Instant AI Preview
              </Button>
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Incident Location / Landmark
              </label>
              <LocationPicker
                location={location}
                setLocation={setLocation}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
            </div>

            {/* Photo Attachments with Drag & Drop */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Attach Proof Photographs (Max 4)
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-4 border-2 border-dashed rounded-2xl transition-all ${isDragging
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                  }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700 shadow-xs">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {imagePreviews.length < 4 && (
                    <label className="flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all aspect-square text-center">
                      <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Drag & Drop</span>
                      <span className="text-[9px] text-slate-400">or browse photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={Send}
              className="w-full py-3.5 text-base shadow-md shadow-blue-500/20"
            >
              Submit & Route Complaint
            </Button>
          </Card>
        </form>

        {/* Right AI Preview Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-floating border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">AI Classification Radar</h4>
                <p className="text-[10px] text-slate-400">Gemini API Instant Assessment</p>
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Assigned Department</span>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    {aiResult.department}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Category</span>
                    <span className="font-bold text-white block mt-0.5">{aiResult.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Urgency Priority</span>
                    <Badge variant={aiResult.priority} className="mt-1">
                      {aiResult.priority}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Generated AI Summary</span>
                  <p className="text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/10 mt-1 leading-relaxed">
                    "{aiResult.summary}"
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Suggested Field Action</span>
                  <p className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60 mt-1 leading-relaxed">
                    {aiResult.suggested_resolution}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-blue-500/40" />
                <p>Type your title and description, then click <b>Run Instant AI Preview</b> to see Gemini AI routing in real-time!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SubmitComplaint;
