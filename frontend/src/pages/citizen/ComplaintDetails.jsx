import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { Sparkles, MapPin, Building2, User, Clock, CheckCircle2, Star, Shield, Image, Send, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      if (res.status === 'success') {
        setComplaint(res.data);
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await api.post(`/complaints/${id}/feedback`, {
        rating,
        comments: feedbackComments
      });
      if (res.status === 'success') {
        showSuccess("Feedback submitted! Thank you.");
        fetchDetails();
      }
    } catch (err) {
      showError(err.message || "Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <SkeletonLoader count={3} type="card" />;
  if (!complaint) return <div className="p-8 text-center font-bold">Complaint not found.</div>;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'In Progress':
        return 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 border-brand-200 dark:border-brand-800';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Link */}
      <Link to="/complaints" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      {/* Header Info Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-800">
              #{complaint.complaint_number}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Filed on {new Date(complaint.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
          {complaint.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-brand-500" />
            <span className="font-semibold">{complaint.department_name || 'General Services'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{complaint.location || 'City Central'}</span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Details & Timeline */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            {/* Images */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500">Citizen Photo Evidence</h4>
                <div className="flex flex-wrap gap-3">
                  {complaint.images.map((img, idx) => (
                    <a key={idx} href={`http://localhost/civic%20ai/backend/${img.image_url}`} target="_blank" rel="noreferrer" className="block w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity">
                      <img src={`http://localhost/civic%20ai/backend/${img.image_url}`} alt="Proof" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Summary & Resolution Card */}
          {complaint.ai_summary && (
            <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-brand-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Gemini AI Executive Summary</h3>
              </div>
              <p className="text-xs text-brand-100 leading-relaxed italic">"{complaint.ai_summary}"</p>

              {complaint.ai_suggested_resolution && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-brand-300 uppercase block">Recommended Resolution Action</span>
                  <p className="text-xs text-emerald-300 mt-0.5">{complaint.ai_suggested_resolution}</p>
                </div>
              )}
            </div>
          )}

          {/* Resolution Proof (If Resolved) */}
          {complaint.status === 'Resolved' && (
            <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-base">Resolution Verification</h3>
              </div>

              {complaint.resolution_notes && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Officer Resolution Report</span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">"{complaint.resolution_notes}"</p>
                </div>
              )}

              {complaint.resolution_image && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Resolution Proof Photo</span>
                  <a href={`http://localhost/civic%20ai/backend/${complaint.resolution_image}`} target="_blank" rel="noreferrer">
                    <img src={`http://localhost/civic%20ai/backend/${complaint.resolution_image}`} alt="Resolution" className="w-48 h-32 object-cover rounded-xl border border-emerald-300" />
                  </a>
                </div>
              )}

              {/* Citizen Feedback Form if not rated yet */}
              {!complaint.rating ? (
                <form onSubmit={handleFeedbackSubmit} className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/80 space-y-3">
                  <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase">Rate Your Service Resolution</h4>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Write a brief review of the municipal officer's action..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs outline-none"
                  />

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Service Feedback
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                  <span className="font-bold text-amber-500">Your Feedback Rating: {complaint.rating} / 5 Stars</span>
                  {complaint.feedback_notes && <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">"{complaint.feedback_notes}"</p>}
                </div>
              )}
            </div>
          )}

          {/* Audit Log Timeline */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Audit History & Timeline</h3>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-6">
              {complaint.timeline && complaint.timeline.map((log) => (
                <div key={log.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-800" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Status changed to <span className="text-brand-600 dark:text-brand-400">{log.status_to}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{log.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      By {log.user_name || 'System'} ({log.user_role || 'Auto'}) &bull; {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">Ticket Information</h3>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Citizen Name</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{complaint.citizen_name}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Category & Priority</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{complaint.category} ({complaint.priority})</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Assigned Officer</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{complaint.officer_name || 'Pending Officer Allocation'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Department Contact</span>
              <p className="font-bold text-brand-600 dark:text-brand-400 mt-0.5">{complaint.department_name}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetails;
