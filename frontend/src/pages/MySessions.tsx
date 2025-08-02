import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMySessions } from '../hooks/useSessions';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Copy, 
  Plus, 
  FileStack,
  Clock,
  Globe
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { formatDate, copyToClipboard, truncateText } from '../utils/helpers';
import { toast } from 'react-toastify';

const MySessions: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, published, loading, error, publishSession, deleteSession, refetch } = useMySessions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handleEdit = (sessionId: string) => {
    navigate(`/editor/${sessionId}`);
  };

  const handlePublish = async (sessionId: string) => {
    setPublishingId(sessionId);
    await publishSession(sessionId);
    setPublishingId(null);
  };

  const handleDelete = async (sessionId: string, status: 'draft' | 'published') => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      setDeletingId(sessionId);
      await deleteSession(sessionId, status);
      setDeletingId(null);
    }
  };

  const handleCopyUrl = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const SessionCard: React.FC<{
    session: any;
    type: 'draft' | 'published';
    index: number;
  }> = ({ session, type, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card group hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-wellness-primary group-hover:text-primary-500 transition-colors">
              {session.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              type === 'draft' 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {type === 'draft' ? (
                <><Clock className="w-3 h-3 inline mr-1" /> Draft</>
              ) : (
                <><Globe className="w-3 h-3 inline mr-1" /> Published</>
              )}
            </span>
          </div>
          <div className="text-sm text-wellness-secondary space-y-1">
            <p>Created: {formatDate(session.created_at)}</p>
            <p>Updated: {formatDate(session.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      {session.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {session.tags.slice(0, 3).map((tag: string) => (
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
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleEdit(session._id)}
          icon={<Edit3 className="w-3 h-3" />}
        >
          Edit
        </Button>
        
        {type === 'draft' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePublish(session._id)}
            loading={publishingId === session._id}
            icon={<CheckCircle className="w-3 h-3" />}
          >
            Publish
          </Button>
        )}
        
        {type === 'published' && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(session.json_file_url, '_blank')}
              icon={<Eye className="w-3 h-3" />}
            >
              View
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopyUrl(session.json_file_url)}
              icon={<Copy className="w-3 h-3" />}
            >
              Copy
            </Button>
          </>
        )}
        
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(session._id, type)}
          loading={deletingId === session._id}
          icon={<Trash2 className="w-3 h-3" />}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading your sessions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-4">
            <p className="text-lg font-medium">Unable to load your sessions</p>
            <p className="text-sm text-wellness-secondary">{error}</p>
          </div>
          <Button onClick={refetch} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalSessions = drafts.length + published.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-wellness-primary mb-2">
              My Sessions
            </h1>
            <p className="text-wellness-secondary">
              Manage your wellness session configurations
            </p>
          </div>
          <Link to="/editor">
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Create New Session
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-500 mb-1">{totalSessions}</div>
            <div className="text-sm text-wellness-secondary">Total Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-amber-500 mb-1">{drafts.length}</div>
            <div className="text-sm text-wellness-secondary">Draft Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{published.length}</div>
            <div className="text-sm text-wellness-secondary">Published Sessions</div>
          </div>
        </motion.div>

        {/* Empty State */}
        {totalSessions === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <FileStack className="w-16 h-16 text-wellness-secondary mx-auto mb-4" />
            <h3 className="text-xl font-medium text-wellness-primary mb-2">
              No sessions yet
            </h3>
            <p className="text-wellness-secondary mb-6 max-w-md mx-auto">
              Create your first wellness session configuration to get started. 
              You can save drafts and publish them when ready.
            </p>
            <Link to="/editor">
              <Button
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Create Your First Session
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Draft Sessions */}
        {drafts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-semibold text-wellness-primary">
                Draft Sessions ({drafts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((session, index) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  type="draft"
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Published Sessions */}
        {published.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-semibold text-wellness-primary">
                Published Sessions ({published.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((session, index) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  type="published"
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MySessions;


