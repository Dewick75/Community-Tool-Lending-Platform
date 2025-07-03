'use client';

import { useState, useEffect } from 'react';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

interface SearchAndFilterProps {
  onSearch: (searchParams: SearchParams) => void;
  filterOptions?: FilterOptions;
  isLoading?: boolean;
}

interface SearchParams {
  query: string;
  category: string;
  city: string;
  availability: string;
  condition: string;
  sortBy: string;
  sortOrder: string;
}

interface FilterOptions {
  categories: string[];
  cities: string[];
  conditions: string[];
  availabilities: string[];
}

export default function SearchAndFilter({ onSearch, filterOptions, isLoading }: SearchAndFilterProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    category: 'all',
    city: '',
    availability: 'all',
    condition: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Trigger search when parameters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔍 SearchAndFilter: Triggering search with params:', searchParams);
      onSearch(searchParams);
    }, 500); // Increased debounce time for better performance

    return () => clearTimeout(timeoutId);
  }, [searchParams, onSearch]);

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchParams({
      query: '',
      category: 'all',
      city: '',
      availability: 'all',
      condition: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = searchParams.query || 
    searchParams.category !== 'all' || 
    searchParams.city || 
    searchParams.availability !== 'all' || 
    searchParams.condition !== 'all';

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <HiSearch className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="🔍 Search tools by name, description, or tags..."
          value={searchParams.query}
          onChange={(e) => updateSearchParam('query', e.target.value)}
          className="block w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400 bg-gray-50/50 hover:bg-white"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          <HiFilter className="h-5 w-5" />
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full px-3 py-1 font-bold shadow-lg">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-600 hover:from-red-200 hover:to-red-300 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            <HiX className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100/50 backdrop-blur-sm">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">🏷️ Category</label>
            <select
              value={searchParams.category}
              onChange={(e) => updateSearchParam('category', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <option value="all">All Categories</option>
              {filterOptions?.categories?.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">📍 Location</label>
            <input
              type="text"
              placeholder="Enter city name"
              value={searchParams.city}
              onChange={(e) => updateSearchParam('city', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
            />
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">✅ Availability</label>
            <select
              value={searchParams.availability}
              onChange={(e) => updateSearchParam('availability', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <option value="all">All Status</option>
              <option value="available">✅ Available</option>
              <option value="borrowed">📋 Borrowed</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="unavailable">❌ Unavailable</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">⭐ Condition</label>
            <select
              value={searchParams.condition}
              onChange={(e) => updateSearchParam('condition', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <option value="all">All Conditions</option>
              <option value="Excellent">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="Good">⭐⭐⭐⭐ Good</option>
              <option value="Fair">⭐⭐⭐ Fair</option>
              <option value="Poor">⭐⭐ Poor</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">🔄 Sort By</label>
            <div className="space-y-3">
              <select
                value={searchParams.sortBy}
                onChange={(e) => updateSearchParam('sortBy', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <option value="createdAt">📅 Date Added</option>
                <option value="name">🔤 Name</option>
                <option value="category">🏷️ Category</option>
                <option value="location.city">📍 City</option>
              </select>
              <select
                value={searchParams.sortOrder}
                onChange={(e) => updateSearchParam('sortOrder', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <option value="desc">⬇️ Newest First</option>
                <option value="asc">⬆️ Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
