import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const DealCard = ({ deal }) => {
    return (
        <Link
            to={`/deals/${deal._id}`}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 hover:shadow-md transition duration-200 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{deal.brandName}</h3>
            </div>

            {/* Deliverables Summary */}
            {deal.deliverables && deal.deliverables.length > 0 && (
                <div className="mb-3 space-y-1">
                    {deal.deliverables.slice(0, 3).map((d, i) => (
                        <div key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">
                            • {d.title}
                        </div>
                    ))}
                    {deal.deliverables.length > 3 && (
                        <div className="text-[10px] text-gray-400 pl-1">
                            +{deal.deliverables.length - 3} more
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>${deal.value.toLocaleString()}</span>
                </div>

                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{new Date(deal.dueDate).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

export default DealCard;
