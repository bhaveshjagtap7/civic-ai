import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { Sparkles, MapPin, Mail, Phone, Upload, Send, ArrowLeft, Shield } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import { motion } from 'framer-motion';

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
  if (!complaint) return <div className="p-8 text-center font-bold text-slate-500">Complaint not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Link */}
      <Link to="/officer/complaints" className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#2563EB] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Officer Desk
      </Link>

      {/* Title Card */}
      <Card hoverEffect={false} className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              #{complaint.complaint_number}
            </span>
            <Badge variant={complaint.status}>{complaint.status}</Badge>
            <Badge variant={complaint.priority}>{complaint.priority} Priority</Badge>
          </div>

          <span className="text-xs text-slate-500">
            Filed: {new Date(complaint.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{complaint.title}</h1>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Complaint Details & Officer Action Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Issue Description */}
          <Card hoverEffect={false} className="p-6 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Citizen Description</h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {complaint.description}
            </p>

            {complaint.images && complaint.images.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
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
          </Card>

          {/* AI Recommended Plan */}
          {complaint.ai_summary && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Gemini AI Suggested Action Plan</h3>
              </div>
              <p className="text-xs text-amber-200 font-semibold">{complaint.ai_suggested_resolution}</p>
            </div>
          )}

          {/* Officer Action Form */}
          <Card hoverEffect={false} className="p-6 sm:p-8 border-2 border-amber-500/40 space-y-5">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm uppercase tracking-wider">
              <Shield className="w-5 h-5" /> Update Ticket Status & Resolution
            </div>

            <FormInput
              label="Select New Status"
              type="select"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'In Progress', label: 'In Progress (Field Squad Dispatched)' },
                { value: 'Resolved', label: 'Resolved (Work Completed)' },
                { value: 'Rejected', label: 'Rejected (Out of Municipal Jurisdiction / Duplicate)' }
              ]}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Resolution Work Notes
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Detail the actions taken by your field maintenance crew..."
                className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            {/* Resolution Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Resolution Proof Photo (Required for Resolved Status)
              </label>
              
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Proof" className="w-32 h-24 object-cover rounded-xl border border-amber-400" />
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-amber-500 transition-all w-48">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-500">Choose Image File</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              loading={updating}
              icon={Send}
              onClick={handleStatusUpdate}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Update Complaint Status
            </Button>
          </Card>

        </div>

        {/* Right Sidebar: Citizen & Location Info */}
        <div className="space-y-6">
          <Card hoverEffect={false} className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Citizen Contact Card
            </h3>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] tracking-wider">Complainant Name</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{complaint.citizen_name}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] tracking-wider">Phone Number</span>
              <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {complaint.citizen_phone || 'Not provided'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] tracking-wider">Email Address</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {complaint.citizen_email}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] tracking-wider">Location Landmark</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {complaint.location}
              </p>
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
};

export default OfficerComplaintDetails;
