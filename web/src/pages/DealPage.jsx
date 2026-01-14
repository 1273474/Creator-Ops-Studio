import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, CheckCircle, ExternalLink, Plus, Save, X, MessageSquare, Send, ChevronDown, ChevronUp, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';

const DealPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit Mode State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editForm, setEditForm] = useState({});

    // New Deliverable State
    const [showAddDeliverable, setShowAddDeliverable] = useState(false);
    const [newDeliverable, setNewDeliverable] = useState({ title: '', link: '', version: 1 });

    // Link Editing State
    const [editingLinkFor, setEditingLinkFor] = useState(null);
    const [tempLink, setTempLink] = useState('');

    // Comments State
    const [expandedDeliverable, setExpandedDeliverable] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [dealRes, deliverableRes] = await Promise.all([
                api.get(`/deals/${id}`),
                api.get(`/deals/${id}/deliverables`)
            ]);
            setDeal(dealRes.data);
            setEditForm(dealRes.data);
            setDeliverables(deliverableRes.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load deal data');
            setLoading(false);
        }
    };

    const handleInfoUpdate = async () => {
        try {
            const res = await api.patch(`/deals/${id}`, editForm);
            setDeal(res.data);
            setIsEditingInfo(false);
        } catch (err) {
            alert('Failed to update deal');
        }
    };

    const handleAddDeliverable = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/deals/${id}/deliverables`, newDeliverable);
            setDeliverables([...deliverables, res.data]);
            setShowAddDeliverable(false);
            setNewDeliverable({ title: '', link: '', version: 1 });
        } catch (err) {
            alert('Failed to add deliverable');
        }
    };

    const handleUpdateLink = async (deliverableId) => {
        try {
            const res = await api.patch(`/deliverables/${deliverableId}`, { link: tempLink });
            setDeliverables(deliverables.map(d => d._id === deliverableId ? res.data : d));
            setEditingLinkFor(null);
            setTempLink('');
        } catch (err) {
            alert('Failed to update link');
        }
    };

    const startEditingLink = (item) => {
        setEditingLinkFor(item._id);
        setTempLink(item.link || '');
    };

    const handleSendToBrand = async (item) => {
        if (!item.link) {
            alert('Please add a link before sending to brand.');
            setExpandedDeliverable(item._id); // Ensure it's expanded so they can see where to add it
            startEditingLink(item); // Open edit mode automatically for convenience
            return;
        }

        try {
            const res = await api.patch(`/deliverables/${item._id}`, { status: 'SENT' });
            setDeliverables(deliverables.map(d => d._id === item._id ? res.data : d));
        } catch (err) {
            alert('Failed to send to brand');
        }
    };

    const handleAddComment = async (e, deliverableId) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await api.post(`/deliverables/${deliverableId}/comments`, { text: newComment });
            setDeliverables(deliverables.map(d => d._id === deliverableId ? res.data : d));
            setNewComment('');
        } catch (err) {
            alert('Failed to post comment');
        }
    };

    const handleDeleteDeal = async () => {
        if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
            try {
                await api.delete(`/deals/${id}`);
                navigate('/dashboard');
            } catch (err) {
                alert('Failed to delete deal');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">{deal.brandName} Campaign</h1>
                </div>
                <button
                    onClick={handleDeleteDeal}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center text-sm font-medium"
                >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete Deal
                </button>
            </header>

            <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* 1. LEFT COLUMN: Deal Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Deal Info</h2>
                            {!isEditingInfo ? (
                                <button onClick={() => setIsEditingInfo(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button onClick={handleInfoUpdate}><Save className="w-4 h-4 text-green-600" /></button>
                                    <button onClick={() => setIsEditingInfo(false)}><X className="w-4 h-4 text-gray-400" /></button>
                                </div>
                            )}
                        </div>

                        {/* Status Manual Control */}
                        <div className="mb-4 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Current Status</label>
                            <select
                                value={deal.status}
                                onChange={async (e) => {
                                    try {
                                        const newStatus = e.target.value;
                                        const res = await api.patch(`/deals/${id}/status`, { status: newStatus });
                                        setDeal(res.data);
                                    } catch (err) {
                                        alert('Failed to update status');
                                    }
                                }}
                                className={`w-full text-sm font-bold p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${deal.status === 'CONFIRMED' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                    deal.status === 'IN_PRODUCTION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        deal.status === 'SENT_FOR_APPROVAL' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            deal.status === 'POSTED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                'bg-purple-50 text-purple-700 border-purple-200'
                                    }`}
                            >
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="IN_PRODUCTION">In Production</option>
                                <option value="SENT_FOR_APPROVAL">Sent for Approval</option>
                                <option value="POSTED">Posted</option>
                                <option value="PAYMENT_PENDING">Payment Pending</option>
                                <option value="PAID">Paid</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand Name</label>
                                {isEditingInfo ? (
                                    <input
                                        className="w-full border rounded p-1 mt-1"
                                        value={editForm.brandName}
                                        onChange={e => setEditForm({ ...editForm, brandName: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{deal.brandName}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Comp ($)</label>
                                {isEditingInfo ? (
                                    <input
                                        type="number"
                                        className="w-full border rounded p-1 mt-1"
                                        value={editForm.value}
                                        onChange={e => setEditForm({ ...editForm, value: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">${deal.value.toLocaleString()}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
                                {isEditingInfo ? (
                                    <input
                                        type="date"
                                        className="w-full border rounded p-1 mt-1"
                                        value={editForm.dueDate ? new Date(editForm.dueDate).toISOString().split('T')[0] : ''}
                                        onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{new Date(deal.dueDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CENTER COLUMN: Deliverables */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Deliverables</h2>
                            <button onClick={() => setShowAddDeliverable(true)} className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        </div>

                        {/* Add Form */}
                        {showAddDeliverable && (
                            <form onSubmit={handleAddDeliverable} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    placeholder="Title (e.g. Draft 1)"
                                    className="w-full mb-2 p-2 rounded border border-gray-300 text-sm"
                                    value={newDeliverable.title}
                                    onChange={e => setNewDeliverable({ ...newDeliverable, title: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Link (Optional for now)"
                                    className="w-full mb-2 p-2 rounded border border-gray-300 text-sm"
                                    value={newDeliverable.link}
                                    onChange={e => setNewDeliverable({ ...newDeliverable, link: e.target.value })}
                                />
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowAddDeliverable(false)} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button type="submit" className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                                </div>
                            </form>
                        )}

                        {/* List */}
                        <div className="space-y-4">
                            {deliverables.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    {/* Header Row */}
                                    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => setExpandedDeliverable(expandedDeliverable === item._id ? null : item._id)}>
                                        <div className="flex items-center space-x-3 w-full">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                item.status === 'CHANGES_REQUESTED' ? 'bg-red-100 text-red-600' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                {item.status === 'APPROVED' ? <CheckCircle className="w-5 h-5" /> :
                                                    item.status === 'CHANGES_REQUESTED' ? <X className="w-5 h-5" /> :
                                                        <span className="text-xs font-bold">{item.version}</span>}
                                            </div>

                                            <div className="flex-1 min-w-0 mr-4">
                                                <p className="text-sm font-medium text-gray-800">{item.title}</p>

                                                {/* Inline Link Editing/Display */}
                                                <div onClick={e => e.stopPropagation()} className="mt-1">
                                                    {editingLinkFor === item._id ? (
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <input
                                                                className="text-xs border border-blue-300 rounded px-2 py-1 flex-1 outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="Paste link here..."
                                                                value={tempLink}
                                                                onChange={e => setTempLink(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button onClick={() => handleUpdateLink(item._id)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><CheckCircle className="w-3 h-3" /></button>
                                                            <button onClick={() => setEditingLinkFor(null)} className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"><X className="w-3 h-3" /></button>
                                                        </div>
                                                    ) : (
                                                        item.link ? (
                                                            <div className="flex items-center space-x-2 group">
                                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center truncate max-w-[150px]">
                                                                    View Link <ExternalLink className="w-3 h-3 ml-1" />
                                                                </a>
                                                                {item.status !== 'APPROVED' && (
                                                                    <button onClick={() => startEditingLink(item)} className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition">
                                                                        <Edit2 className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => startEditingLink(item)} className="text-xs text-orange-500 hover:text-orange-700 flex items-center font-medium">
                                                                <LinkIcon className="w-3 h-3 mr-1" /> Add Link
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 flex-shrink-0">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                item.status === 'CHANGES_REQUESTED' ? 'bg-red-100 text-red-700' :
                                                    item.status === 'SENT' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                            {expandedDeliverable === item._id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Section (Comments & Actions) */}
                                    {expandedDeliverable === item._id && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-4">

                                            {/* Action Buttons */}
                                            {item.status === 'DRAFT' && (
                                                <div className="mb-4">
                                                    <button
                                                        onClick={() => handleSendToBrand(item)}
                                                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        <span>Send to Brand for Review</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Comments List */}
                                            <div className="space-y-3 mb-4">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase">Comments & Notes</h4>

                                                {item.comments && item.comments.length > 0 ? (
                                                    item.comments.map((comment, idx) => (
                                                        <div key={idx} className={`text-sm p-3 rounded-lg ${comment.authorRole === 'BRAND' ? 'bg-white border border-l-4 border-l-purple-500 border-gray-200' : 'bg-blue-100 text-blue-900'}`}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className={`text-xs font-bold ${comment.authorRole === 'BRAND' ? 'text-purple-600' : 'text-blue-700'}`}>
                                                                    {comment.authorRole === 'BRAND' ? 'Brand Feedback' : 'You'}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <p>{comment.text}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">No comments yet.</p>
                                                )}
                                            </div>

                                            {/* Add Comment Input */}
                                            <form onSubmit={(e) => handleAddComment(e, item._id)} className="flex items-center space-x-2">
                                                <input
                                                    className="flex-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="Add a note... (e.g. check 0:45)"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />
                                                <button type="submit" disabled={!newComment.trim()} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                            </form>

                                        </div>
                                    )}
                                </div>
                            ))}

                            {deliverables.length === 0 && !showAddDeliverable && (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    No deliverables yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: Approvals & Comments */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Approvals</h2>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">Share with Brand</p>
                            <p className="text-xs text-blue-600 mb-3">Copy this link to let brands review assets without logging in.</p>
                            <div className="flex bg-white rounded border border-blue-200 p-2 items-center">
                                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500 mr-2">
                                    {`${window.location.origin}/approval/${deal.shareToken}`}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/approval/${deal.shareToken}`);
                                        const btn = document.getElementById('copy-btn');
                                        if (btn) {
                                            btn.innerText = 'Copied!';
                                            setTimeout(() => btn.innerText = 'COPY', 2000);
                                        }
                                    }}
                                    id="copy-btn"
                                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded uppercase transition"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default DealPage;
