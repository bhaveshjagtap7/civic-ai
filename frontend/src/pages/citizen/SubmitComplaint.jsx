import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import VoiceInputButton from '../../components/common/VoiceInputButton';
import LocationPicker from '../../components/common/LocationPicker';
import { Sparkles, Upload, X, Send, AlertTriangle, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import api from '../../services/api';

const SubmitComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

  // Image upload handling
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 4) {
      showError("You can upload a maximum of 4 image attachments.");
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          AI Auto-Routed Grievance Filing
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Submit Citizen Complaint
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Describe your civic issue below. Our Gemini AI system automatically determines category, urgency priority, and assigns the responsible department officer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Complaint Subject / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large 2-foot deep pothole near Metro Gate 3"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Description & Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Detailed Description *
              </label>
              <VoiceInputButton onTranscript={(text) => setDescription((prev) => (prev ? prev + ' ' + text : text))} />
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, street details, duration, and safety concerns..."
              required
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 leading-relaxed"
            />
          </div>

          {/* AI Trigger Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={analyzeWithAI}
              disabled={analyzing || !title || !description}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Gemini AI Analyzing...' : 'Run Instant AI Preview'}</span>
            </button>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Incident Location / Landmark
            </label>
            <LocationPicker
              location={location}
              setLocation={setLocation}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />
          </div>

          {/* Photo Attachments */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Attach Proof Photographs (Max 4)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 4 && (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-slate-800/60 transition-all aspect-square">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-500">Upload Photo</span>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit & Route Ticket</span>
              </>
            )}
          </button>
        </form>

        {/* Right AI Preview Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-brand-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">AI Classification Radar</h4>
                <p className="text-[11px] text-brand-200">Real-time Gemini API Assessment</p>
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-brand-300 font-semibold block text-[10px] uppercase">Assigned Department</span>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-brand-400" />
                    {aiResult.department}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-brand-300 font-semibold block text-[10px] uppercase">Category</span>
                    <span className="font-bold text-white block mt-0.5">{aiResult.category}</span>
                  </div>
                  <div>
                    <span className="text-brand-300 font-semibold block text-[10px] uppercase">Urgency Priority</span>
                    <span className={`inline-block font-bold px-2 py-0.5 rounded mt-0.5 ${
                      aiResult.priority === 'Critical' ? 'bg-rose-500 text-white' :
                      aiResult.priority === 'High' ? 'bg-rose-900 text-rose-200' :
                      aiResult.priority === 'Medium' ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-200'
                    }`}>
                      {aiResult.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-brand-300 font-semibold block text-[10px] uppercase">Generated AI Summary</span>
                  <p className="text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/10 mt-1">
                    "{aiResult.summary}"
                  </p>
                </div>

                <div>
                  <span className="text-brand-300 font-semibold block text-[10px] uppercase">Suggested Field Action</span>
                  <p className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60 mt-1">
                    {aiResult.suggested_resolution}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-brand-200/60 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-brand-400/40" />
                <p>Type your title and description above, then click <b>Run Instant AI Preview</b> to see Gemini AI routing results in real-time!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubmitComplaint;
