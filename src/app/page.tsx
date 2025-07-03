'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RemoveBtn from '@/components/RemoveBtn';
import SearchAndFilter from '@/components/SearchAndFilter';
import { HiPencilAlt, HiLocationMarker, HiUser, HiClock, HiCurrencyDollar } from 'react-icons/hi';

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
  status?: string; // For backward compatibility
  borrowingTerms?: {
    maxDuration: number;
    deposit: number;
    instructions?: string;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
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

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Search function
  const handleSearch = useCallback(async (searchParams: SearchParams) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/tools/search?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setTools(data.tools || []);
        setFilterOptions(data.filterOptions || {});
        setTotalResults(data.totalResults || 0);
      } else {
        console.error('Search failed:', data.error);
        setTools([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setTools([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    setMounted(true);
    handleSearch({
      query: '',
      category: 'all',
      city: '',
      availability: 'all',
      condition: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, [handleSearch]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Community Tools
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              🔧 Share tools, build community. Discover what your neighbors have to offer and contribute your own tools to help others. 🌱
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Sustainable Sharing
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Local Community
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Cost Effective
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={handleSearch}
          filterOptions={filterOptions}
          isLoading={isLoading}
        />

        {/* Results Summary */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="text-gray-600 font-medium">Searching tools...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{totalResults}</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Found {totalResults} tool{totalResults !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Link
                href="/add-tool"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                + Add Tool
              </Link>
            </div>
          </div>
        </div>

        {tools && tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tools.map((tool) => (
              <div key={tool._id} className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-white/20 hover:border-purple-200">
                {/* Tool Header */}
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-6">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-white truncate flex-1 group-hover:text-blue-100 transition-colors duration-300">
                        {tool.name}
                      </h2>
                      {tool.category && (
                        <span className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30 font-medium">
                          {tool.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        (tool.availability || tool.status) === 'available'
                          ? 'bg-green-400 text-green-900 shadow-green-200'
                          : (tool.availability || tool.status) === 'borrowed'
                          ? 'bg-yellow-400 text-yellow-900 shadow-yellow-200'
                          : 'bg-red-400 text-red-900 shadow-red-200'
                      }`}>
                        {(() => {
                          const status = tool.availability || tool.status || 'available';
                          return status.charAt(0).toUpperCase() + status.slice(1);
                        })()}
                      </span>
                      {tool.condition && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30">
                          {tool.condition}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tool Content */}
                <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                  <p className="text-gray-700 text-sm leading-relaxed mb-5 line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">
                    {tool.description}
                  </p>

                  {/* Tool Details */}
                  <div className="space-y-3 mb-5">
                    {tool.location && (
                      <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 group-hover:bg-blue-50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <HiLocationMarker className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{tool.location.city}, {tool.location.area}</span>
                      </div>
                    )}

                    {tool.owner && (
                      <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 group-hover:bg-purple-50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <HiUser className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{tool.owner.name}</span>
                      </div>
                    )}

                    {tool.borrowingTerms && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-green-700">
                            <HiClock className="h-4 w-4 mr-2" />
                            <span className="font-medium">Max {tool.borrowingTerms.maxDuration} days</span>
                          </div>
                          {tool.borrowingTerms.deposit > 0 && (
                            <div className="flex items-center text-blue-700">
                              <HiCurrencyDollar className="h-4 w-4 mr-1" />
                              <span className="font-medium">LKR {tool.borrowingTerms.deposit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="mb-5">
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200 font-medium">
                            #{tag}
                          </span>
                        ))}
                        {tool.tags.length > 3 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">+{tool.tags.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                    <div className="flex gap-3">
                      <Link
                        href={`/edit-tool/${tool._id}`}
                        className="group/btn flex items-center justify-center w-11 h-11 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-200/50"
                        title="Edit Tool"
                      >
                        <HiPencilAlt size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                      </Link>
                      <div className="group/btn flex items-center justify-center w-11 h-11 bg-gradient-to-r from-red-100 to-red-200 text-red-600 rounded-xl hover:from-red-200 hover:to-red-300 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-red-200/50">
                        <RemoveBtn id={tool._id} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'Recently added'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No tools found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or be the first to add a tool!</p>
              <Link
                href="/add-tool"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Add Your First Tool
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
