'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category?: string;
  condition?: string;
  location?: {
    city: string;
    area: string;
    postalCode?: string;
  };
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
  availability?: string;
  borrowingTerms?: {
    maxDuration: number;
    deposit: number;
    instructions?: string;
  };
  tags?: string[];
}

interface EditToolFormProps {
    id: string;
    name: string;
    description: string;
}

export default function EditToolForm({ id, name, description }: EditToolFormProps) {
    const [, setTool] = useState<Tool | null>(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [category, setCategory] = useState('Other');
    const [condition, setCondition] = useState('Good');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [availability, setAvailability] = useState('available');
    const [maxDuration, setMaxDuration] = useState(7);
    const [deposit, setDeposit] = useState(0);
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');

    const router = useRouter();

    const categories = [
        'Power Tools', 'Hand Tools', 'Garden Tools', 'Automotive',
        'Construction', 'Electrical', 'Plumbing', 'Cleaning',
        'Kitchen Appliances', 'Sports & Recreation', 'Other'
    ];

    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    const availabilityOptions = ['available', 'borrowed', 'maintenance', 'unavailable'];

    // Fetch full tool data
    useEffect(() => {
        const fetchTool = async () => {
            try {
                const response = await fetch(`/api/tools/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const toolData = data.tool;
                    setTool(toolData);

                    // Populate form fields
                    setNewName(toolData.name || '');
                    setNewDescription(toolData.description || '');
                    setCategory(toolData.category || 'Other');
                    setCondition(toolData.condition || 'Good');
                    setCity(toolData.location?.city || '');
                    setArea(toolData.location?.area || '');
                    setPostalCode(toolData.location?.postalCode || '');
                    setOwnerName(toolData.owner?.name || '');
                    setOwnerEmail(toolData.owner?.email || '');
                    setOwnerPhone(toolData.owner?.phone || '');
                    setAvailability(toolData.availability || toolData.status || 'available');
                    setMaxDuration(toolData.borrowingTerms?.maxDuration || 7);
                    setDeposit(toolData.borrowingTerms?.deposit || 0);
                    setInstructions(toolData.borrowingTerms?.instructions || '');
                    setTags(toolData.tags?.join(', ') || '');
                }
            } catch (error) {
                console.error('Error fetching tool:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTool();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!newName || !newDescription || !city || !area || !ownerName || !ownerEmail) {
            alert('Please fill in all required fields.');
            return;
        }

        const toolData = {
            name: newName,
            description: newDescription,
            category,
            condition,
            location: {
                city,
                area,
                postalCode
            },
            owner: {
                name: ownerName,
                email: ownerEmail,
                phone: ownerPhone
            },
            availability,
            borrowingTerms: {
                maxDuration: Number(maxDuration),
                deposit: Number(deposit),
                instructions
            },
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        };

        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toolData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update tool');
            }

            alert('Tool updated successfully!');
            router.push('/');
            router.refresh();
        } catch (error) {
            console.log(error);
            alert('Error updating tool: ' + error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tool data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Edit Tool
                    </h1>
                    <p className="text-xl text-gray-600">Update your tool information</p>
                </div>

                {/* Form */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                                        Tool Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        onChange={(e) => setNewName(e.target.value)}
                                        value={newName}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="e.g., Electric Drill, Lawn Mower"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-3">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        onChange={(e) => setCategory(e.target.value)}
                                        value={category}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    value={newDescription}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none" style={{ color: 'black' }}
                                    placeholder="Describe your tool, its condition, and any special features..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div>
                                    <label htmlFor="condition" className="block text-sm font-bold text-gray-700 mb-3">
                                        Condition
                                    </label>
                                    <select
                                        id="condition"
                                        onChange={(e) => setCondition(e.target.value)}
                                        value={condition}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                    >
                                        {conditions.map(cond => (
                                            <option key={cond} value={cond}>{cond}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="availability" className="block text-sm font-bold text-gray-700 mb-3">
                                        Availability
                                    </label>
                                    <select
                                        id="availability"
                                        onChange={(e) => setAvailability(e.target.value)}
                                        value={availability}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                    >
                                        {availabilityOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-bold text-gray-700 mb-3">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        id="tags"
                                        type="text"
                                        onChange={(e) => setTags(e.target.value)}
                                        value={tags}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="e.g., cordless, 18V, battery"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Location</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-3">
                                        City *
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        onChange={(e) => setCity(e.target.value)}
                                        value={city}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="e.g., Colombo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="area" className="block text-sm font-bold text-gray-700 mb-3">
                                        Area/District *
                                    </label>
                                    <input
                                        id="area"
                                        type="text"
                                        onChange={(e) => setArea(e.target.value)}
                                        value={area}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="e.g., Nugegoda"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-bold text-gray-700 mb-3">
                                        Postal Code
                                    </label>
                                    <input
                                        id="postalCode"
                                        type="text"
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        value={postalCode}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="e.g., 10250"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="ownerName" className="block text-sm font-bold text-gray-700 mb-3">
                                        Your Name *
                                    </label>
                                    <input
                                        id="ownerName"
                                        type="text"
                                        onChange={(e) => setOwnerName(e.target.value)}
                                        value={ownerName}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" style={{ color: 'black' }}
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ownerEmail" className="block text-sm font-bold text-gray-700 mb-3">
                                        Email Address *
                                    </label>
                                    <input
                                        id="ownerEmail"
                                        type="email"
                                        onChange={(e) => setOwnerEmail(e.target.value)}
                                        value={ownerEmail}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="ownerPhone" className="block text-sm font-bold text-gray-700 mb-3">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="ownerPhone"
                                    type="tel"
                                    onChange={(e) => setOwnerPhone(e.target.value)}
                                    value={ownerPhone}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                        </div>

                        {/* Borrowing Terms */}
                        <div className="pb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Borrowing Terms</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="maxDuration" className="block text-sm font-bold text-gray-700 mb-3">
                                        Maximum Loan Duration (days)
                                    </label>
                                    <input
                                        id="maxDuration"
                                        type="number"
                                        min="1"
                                        max="30"
                                        onChange={(e) => setMaxDuration(Number(e.target.value))}
                                        value={maxDuration}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="deposit" className="block text-sm font-bold text-gray-700 mb-3">
                                        Security Deposit (LKR)
                                    </label>
                                    <input
                                        id="deposit"
                                        type="number"
                                        min="0"
                                        onChange={(e) => setDeposit(Number(e.target.value))}
                                        value={deposit}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="instructions" className="block text-sm font-bold text-gray-700 mb-3">
                                    Special Instructions
                                </label>
                                <textarea
                                    id="instructions"
                                    onChange={(e) => setInstructions(e.target.value)}
                                    value={instructions}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                                    placeholder="Any special care instructions, pickup arrangements, etc."
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                className="flex-1 py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Update Tool
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="flex-1 py-4 px-8 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {/* Help Text */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Tip:</strong> Keep your tool information up to date to help community members find exactly what they need. Include any recent changes in condition or availability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
