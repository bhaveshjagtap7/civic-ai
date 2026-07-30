import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { Sparkles, MapPin, Building2, User, Phone, Mail, Clock, CheckCircle2, Upload, Send, ArrowLeft, Shield } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const OfficerComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Update Form State
  const [status, setStatus] = useState('In Progress');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionImage, setResolutionImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      if (res.status === 'success') {
        setComplaint(res.data);
        setStatus(res.data.status);
        if (res.data.resolution_notes) setResolutionNotes(res.data.resolution_notes);
      }
    } catch (err) {
      showError("Could not load complaint details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolutionImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('resolution_notes', resolutionNotes);
      if (resolutionImage) {
        formData.append('resolution_image', resolutionImage);
      }

      const res = await api.post(`/complaints/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 'success') {
        showSuccess(`Complaint status updated to ${status}!`);
        fetchDetails();
      }
    } catch (err) {
      showError(err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <SkeletonLoader count={3} type="card" />;
  if (!complaint) return <div className="p-8 text-center font-bold">Complaint not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Back Link */}
      <Link to="/officer/complaints" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600">
        <ArrowLeft className="w-4 h-4" /> Back to Officer Desk
      </Link>

      {/* Title Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
              #{complaint.complaint_number}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              Current Status: {complaint.status}
            </span>
          </div>

          <span className="text-xs text-slate-500">
            Filed: {new Date(complaint.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{complaint.title}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Complaint Details & Officer Action Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Issue Description */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Citizen Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            {complaint.images && complaint.images.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500">Citizen Photo Attachments</h4>
                <div className="flex flex-wrap gap-3">
                  {complaint.images.map((img, idx) => (
                    <a key={idx} href={`http://localhost/civic%20ai/backend/${img.image_url}`} target="_blank" rel="noreferrer" className="block w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-90">
                      <img src={`http://localhost/civic%20ai/backend/${img.image_url}`} alt="Proof" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Recommended Plan */}
          {complaint.ai_summary && (
            <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white p-6 rounded-3xl shadow-lg border border-amber-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Gemini AI Suggested Action Plan</h3>
              </div>
              <p className="text-xs text-amber-200 font-semibold">{complaint.ai_suggested_resolution}</p>
            </div>
          )}

          {/* Officer Action Form */}
          <form onSubmit={handleStatusUpdate} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm uppercase tracking-wider">
              <Shield className="w-5 h-5" /> Update Ticket Status & Resolution
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select New Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none text-slate-900 dark:text-slate-100"
              >
                <option value="In Progress">In Progress (Field Squad Dispatched)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Rejected">Rejected (Out of Municipal Jurisdiction / Duplicate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Resolution Work Notes
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Detail the actions taken by your field maintenance crew..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Resolution Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Upload Resolution Proof Photo (Required for Resolved Status)
              </label>
              
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Proof" className="w-32 h-24 object-cover rounded-xl border border-amber-400" />
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-amber-500 transition-all w-48">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-500">Choose Image File</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Update Complaint Status</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Sidebar: Citizen & Location Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
              Citizen Contact Card
            </h3>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Complainant Name</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{complaint.citizen_name}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Phone Number</span>
              <p className="font-bold text-brand-600 dark:text-brand-400 mt-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {complaint.citizen_phone || 'Not provided'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Email Address</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {complaint.citizen_email}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Location Landmark</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {complaint.location}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerComplaintDetails;
