'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToolPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [condition, setCondition] = useState('Good');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !description || !city || !area || !ownerName || !ownerEmail) {
      alert('Please fill in all required fields.');
      return;
    }

    const toolData = {
      name,
      description,
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
      borrowingTerms: {
        maxDuration: Number(maxDuration),
        deposit: Number(deposit),
        instructions
      },
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      });

      if (res.ok) {
        alert('Tool added successfully!');
        router.push('/'); // Redirect to homepage on success
        router.refresh(); // Tell Next.js to refresh the data on the homepage
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create a tool');
      }
    } catch (error) {
      console.log(error);
      alert('Error creating tool: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Add a New Tool</h1>
          <p className="text-gray-600">Share your tools with the community and help your neighbors</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tool Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="e.g., Electric Drill, Lawn Mower"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                  placeholder="Describe your tool, its condition, and any special features..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    id="condition"
                    onChange={(e) => setCondition(e.target.value)}
                    value={condition}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    onChange={(e) => setTags(e.target.value)}
                    value={tags}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="e.g., cordless, 18V, battery"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="e.g., Colombo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                    Area/District *
                  </label>
                  <input
                    id="area"
                    type="text"
                    onChange={(e) => setArea(e.target.value)}
                    value={area}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="e.g., Nugegoda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    onChange={(e) => setPostalCode(e.target.value)}
                    value={postalCode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="e.g., 10250"
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="ownerName"
                    type="text"
                    onChange={(e) => setOwnerName(e.target.value)}
                    value={ownerName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="ownerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="ownerEmail"
                    type="email"
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    value={ownerEmail}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="ownerPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  id="ownerPhone"
                  type="tel"
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  value={ownerPhone}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>

            {/* Borrowing Terms */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Terms</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxDuration" className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Loan Duration (days)
                  </label>
                  <input
                    id="maxDuration"
                    type="number"
                    min="1"
                    max="30"
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                    value={maxDuration}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="deposit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Security Deposit (LKR)
                  </label>
                  <input
                    id="deposit"
                    type="number"
                    min="0"
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    value={deposit}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  id="instructions"
                  onChange={(e) => setInstructions(e.target.value)}
                  value={instructions}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                  placeholder="Any special care instructions, pickup arrangements, etc."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Add Tool to Community
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Be descriptive! Include details like brand, model, condition, and any accessories to help community members understand what you're sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
