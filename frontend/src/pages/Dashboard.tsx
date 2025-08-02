import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePublicSessions } from '../hooks/useSessions';
import { Search, ExternalLink, Copy, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { formatDate, copyToClipboard, truncateText } from '../utils/helpers';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { sessions, loading, error, pagination, refetch } = usePublicSessions(currentPage, 9);

  // Filter sessions based on search term and tags
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => session.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Get unique tags from all sessions for filter
  const allTags = [...new Set(sessions.flatMap(session => session.tags))];

  const handleCopyUrl = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading wellness sessions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-wellness-primary mb-4">
            Wellness Session Platform
          </h1>
          <p className="text-lg text-wellness-secondary max-w-2xl mx-auto">
            Discover and explore wellness session configurations shared by our community. 
            Find mindfulness, meditation, and wellness practices to enhance your journey.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search sessions by title or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
            {(searchTerm || selectedTags.length > 0) && (
              <Button
                variant="secondary"
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Tag Filters */}
          {showFilters && allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-4"
            >
              <h3 className="text-sm font-medium text-wellness-primary mb-3">
                Filter by Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-gray-100 text-wellness-secondary border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-error mb-4">
              <p className="text-lg font-medium">Unable to load sessions</p>
              <p className="text-sm text-wellness-secondary">{error}</p>
            </div>
            <Button onClick={refetch} variant="primary">
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Sessions Grid */}
        {!error && (
          <>
            {filteredSessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-wellness-secondary">
                  <p className="text-lg font-medium mb-2">
                    {searchTerm || selectedTags.length > 0 
                      ? 'No sessions match your filters' 
                      : 'No wellness sessions available yet'
                    }
                  </p>
                  <p className="text-sm">
                    {searchTerm || selectedTags.length > 0 
                      ? 'Try adjusting your search terms or filters'
                      : 'Check back later for new wellness sessions from the community'
                    }
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-wellness-primary mb-2 group-hover:text-primary-500 transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-sm text-wellness-secondary">
                        Created {formatDate(session.created_at)}
                      </p>
                    </div>

                    {/* Tags */}
                    {session.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {session.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {session.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-wellness-secondary rounded-full">
                              +{session.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* JSON URL Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-wellness-secondary mb-1">
                        Configuration URL:
                      </p>
                      <p className="text-sm text-wellness-primary font-mono bg-gray-50 p-2 rounded border truncate">
                        {truncateText(session.json_file_url, 40)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => window.open(session.json_file_url, '_blank')}
                        icon={<ExternalLink className="w-3 h-3" />}
                        className="flex-1"
                      >
                        View Config
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyUrl(session.json_file_url)}
                        icon={<Copy className="w-3 h-3" />}
                      >
                        Copy
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-4"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-wellness-secondary hover:bg-primary-50 hover:text-primary-500 border'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </motion.div>
            )}

            {/* Results Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6 text-sm text-wellness-secondary"
            >
              <p>
                Showing {Math.min((currentPage - 1) * 9 + 1, pagination.totalSessions)}–
                {Math.min(currentPage * 9, pagination.totalSessions)} of {pagination.totalSessions} sessions
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


