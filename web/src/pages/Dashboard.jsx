import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import DealCard from '../components/DealCard';
import { LogOut, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLUMNS = {
    CONFIRMED: 'Confirmed',
    IN_PRODUCTION: 'In Production',
    SENT_FOR_APPROVAL: 'Sent for Approval',
    POSTED: 'Posted',
    PAYMENT_PENDING: 'Payment Pending',
    PAID: 'Paid',
};

const Dashboard = () => {
    const { deals, fetchDeals, createDeal } = useStore();
    const navigate = useNavigate();

    // Create Deal Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDeal, setNewDeal] = useState({
        brandName: '',
        value: '',
        dueDate: '',
    });

    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateDeal = async (e) => {
        e.preventDefault();
        try {
            await createDeal({
                ...newDeal,
                value: Number(newDeal.value)
            });
            setIsModalOpen(false);
            setNewDeal({ brandName: '', value: '', dueDate: '' });
        } catch (err) {
            alert('Failed to create deal');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">CreatorOps Studio</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Deal</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>

                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                        ME
                    </div>
                </div>
            </header>

            {/* Kanban Board (Static Columns) */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-8">
                <div className="flex space-x-6 h-full min-w-max">
                    {Object.entries(COLUMNS).map(([statusKey, title]) => {
                        const columnDeals = deals.filter(deal => deal.status === statusKey);

                        return (
                            <div key={statusKey} className="w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200/60 p-4">
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider flex items-center">
                                        {title}
                                        <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                                            {columnDeals.length}
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2">
                                    {columnDeals.map((deal) => (
                                        <DealCard key={deal._id} deal={deal} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Create Deal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Create New Deal</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateDeal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Nike"
                                    value={newDeal.brandName}
                                    onChange={e => setNewDeal({ ...newDeal, brandName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="5000"
                                        value={newDeal.value}
                                        onChange={e => setNewDeal({ ...newDeal, value: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newDeal.dueDate}
                                        onChange={e => setNewDeal({ ...newDeal, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition mt-2"
                            >
                                Create Deal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
