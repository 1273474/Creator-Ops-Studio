import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle, AlertCircle, Download, MessageSquare, ChevronDown, ChevronUp, X } from 'lucide-react';

const BrandApproval = () => {
    const { token } = useParams();
    const [deal, setDeal] = useState(null);
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Feedback Modal State
    const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, deliverableId: null });
    const [feedbackText, setFeedbackText] = useState('');

    // Expanded Comments State
    const [expandedDeliverable, setExpandedDeliverable] = useState(null);

    useEffect(() => {
        fetchDealData();
    }, [token]);

    const fetchDealData = async () => {
        try {
            const res = await api.get(`/public/deals/${token}`);
            setDeal(res.data.deal);
            setDeliverables(res.data.deliverables);
            setLoading(false);
        } catch (err) {
            setError('Invalid link or deal not found.');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, comment = null) => {
        try {
            const payload = { status };
            if (comment) payload.comment = comment;

            const res = await api.patch(`/public/deliverables/${id}/status`, payload);
            setDeliverables(deliverables.map(d => d._id === id ? res.data : d));

            // Close modal if open
            setFeedbackModal({ isOpen: false, deliverableId: null });
            setFeedbackText('');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const openFeedbackModal = (id) => {
        setFeedbackModal({ isOpen: true, deliverableId: id });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold text-gray-800">{error}</h1>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Minimal Header */}
            <header className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reviewing</span>
                    <h1 className="text-2xl font-bold text-gray-900">{deal.brandName} Campaign</h1>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium tracking-wide">DUE DATE</p>
                    <p className="font-semibold text-gray-700">{new Date(deal.dueDate).toLocaleDateString()}</p>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-8">
                <div className="space-y-8">
                    {deliverables.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Version {item.version}</span>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center font-medium">
                                                View Asset <Download className="w-4 h-4 ml-1" />
                                            </a>
                                            {item.comments && item.comments.length > 0 && (
                                                <button onClick={() => setExpandedDeliverable(expandedDeliverable === item._id ? null : item._id)} className="flex items-center hover:text-gray-700 transition">
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    {item.comments.length} Notes
                                                    {expandedDeliverable === item._id ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                                                </button>
                                            )}
                                        </div>

                                        {/* Link Preview / Embed Placeholder */}
                                        <div className="bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                                            <p className="text-gray-400 text-sm font-medium mb-2">Safe Preview Mode</p>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm text-gray-700 hover:bg-gray-50 transition">
                                                Open Link
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3 min-w-[180px]">
                                        {item.status === 'APPROVED' ? (
                                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                                                <div className="flex items-center justify-center text-green-600 mb-2">
                                                    <CheckCircle className="w-8 h-8" />
                                                </div>
                                                <p className="font-bold text-green-700">Approved</p>
                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, 'CHANGES_REQUESTED')} // For simplicity, direct switch back
                                                    className="text-xs text-green-600 underline mt-2 hover:text-green-800"
                                                >
                                                    Change Status
                                                </button>
                                            </div>
                                        ) : item.status === 'CHANGES_REQUESTED' ? (
                                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                                                <div className="flex items-center justify-center text-purple-600 mb-2">
                                                    <AlertCircle className="w-8 h-8" />
                                                </div>
                                                <p className="font-bold text-purple-700">Changes Requested</p>
                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, 'APPROVED')}
                                                    className="text-xs text-purple-600 underline mt-2 hover:text-purple-800"
                                                >
                                                    Approve Instead
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, 'APPROVED')}
                                                    className="flex items-center justify-center p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-sm transition"
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    <span className="font-bold text-sm">Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => openFeedbackModal(item._id)}
                                                    className="flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50 transition"
                                                >
                                                    <XCircle className="w-5 h-5 mr-2" />
                                                    <span className="font-bold text-sm">Request Changes</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section (Expanded) */}
                            {expandedDeliverable === item._id && item.comments && item.comments.length > 0 && (
                                <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">History & Notes</h4>
                                    {item.comments.map((comment, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg text-sm ${comment.authorRole === 'CREATOR' ? 'bg-blue-100 text-blue-900 ml-4' : 'bg-white border border-l-4 border-l-purple-500 border-gray-200 mr-4'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-xs font-bold ${comment.authorRole === 'CREATOR' ? 'text-blue-700' : 'text-purple-600'}`}>
                                                    {comment.authorRole === 'CREATOR' ? 'Creator Note' : 'Brand Feedback'}
                                                </span>
                                                <span className="text-[10px] text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="leading-relaxed">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {deliverables.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                            <p className="text-gray-500 font-medium">No deliverables ready for review yet.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Feedback Modal */}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Request Changes</h2>
                            <button onClick={() => setFeedbackModal({ isOpen: false, deliverableId: null })} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">What needs to be changed?</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 h-32 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                placeholder="Please refer to specific timestamps (e.g. 0:15 music is too loud)..."
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setFeedbackModal({ isOpen: false, deliverableId: null })}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(feedbackModal.deliverableId, 'CHANGES_REQUESTED', feedbackText)}
                                disabled={!feedbackText.trim()}
                                className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition transform active:scale-95"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandApproval;
