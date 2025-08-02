import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../hooks/useSessions';
import useAutoSave from '../hooks/useAutoSave';
import { 
  Save, 
  CheckCircle, 
  ArrowLeft,
  Link as LinkIcon,
  Tag,
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { sessionAPI } from '../services/api';
import { isValidUrl, parseTags, joinTags, formatTimestamp } from '../utils/helpers';
import { toast } from 'react-toastify';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    tags?: string;
    jsonFileUrl?: string;
  }>({});

  // Auto-save state
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load existing session if editing
  const { session, loading: sessionLoading, error: sessionError } = useSession(id);

  // Auto-save hook
  useAutoSave({
    data: {
      id,
      title: title.trim(),
      tags: parseTags(tags),
      json_file_url: jsonFileUrl.trim(),
    },
    onSaveSuccess: (timestamp) => {
      setLastSavedAt(timestamp);
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
    },
  });

  // Load session data when editing
  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setTags(session.tags ? joinTags(Array.isArray(session.tags) ? session.tags : [session.tags]) : '');
      setJsonFileUrl(session.json_file_url || '');
    }
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!jsonFileUrl.trim()) {
      newErrors.jsonFileUrl = 'JSON file URL is required';
    } else if (!isValidUrl(jsonFileUrl.trim())) {
      newErrors.jsonFileUrl = 'Please enter a valid URL';
    }

    const parsedTags = parseTags(tags);
    if (parsedTags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await sessionAPI.saveDraftSession({
        id,
        title: title.trim(),
        tags: parseTags(tags),
        json_file_url: jsonFileUrl.trim(),
      });

      if (response.success) {
        setLastSavedAt(new Date());
        toast.success('Draft saved successfully!');
        
        // If this was a new session, redirect to edit mode
        if (!isEditing && response.data._id) {
          navigate(`/editor/${response.data._id}`, { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);
    try {
      // First save as draft to ensure latest changes and get the session ID
      const saveResponse = await sessionAPI.saveDraftSession({
        id,
        title: title.trim(),
        tags: parseTags(tags),
        json_file_url: jsonFileUrl.trim(),
      });

      if (!saveResponse.success) {
        toast.error('Failed to save draft before publishing');
        return;
      }

      // Get the session ID (either existing or newly created)
      const sessionId = id || saveResponse.data.session._id;

      if (!sessionId) {
        toast.error('Unable to get session ID. Please try saving as draft first.');
        return;
      }

      // Then publish using the correct session ID
      const response = await sessionAPI.publishSession(sessionId);
      if (response.success) {
        toast.success('Session published successfully!');
        navigate('/my-sessions');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish session');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    navigate('/my-sessions');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading session..." />
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-medium text-wellness-primary mb-2">
            Session not found
          </h3>
          <p className="text-wellness-secondary mb-6">
            The session you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={handleBack} variant="primary">
            Back to My Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-wellness-primary">
              {isEditing ? 'Edit Session' : 'Create New Session'}
            </h1>
            <p className="text-wellness-secondary">
              {isEditing 
                ? 'Update your wellness session configuration'
                : 'Create a new wellness session configuration'
              }
            </p>
          </div>
        </motion.div>

        {/* Editor Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card">
            <form className="space-y-6">
              {/* Title Field */}
              <div>
                <Input
                  label="Session Title"
                  placeholder="Enter a descriptive title for your session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  icon={<FileText className="w-4 h-4" />}
                  required
                />
              </div>

              {/* Tags Field */}
              <div>
                <Input
                  label="Tags"
                  placeholder="meditation, mindfulness, relaxation (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  error={errors.tags}
                  icon={<Tag className="w-4 h-4" />}
                />
                <p className="mt-1 text-xs text-wellness-secondary">
                  Add tags to help others discover your session. Use commas to separate multiple tags.
                </p>
              </div>

              {/* JSON File URL Field */}
              <div>
                <Input
                  label="JSON Configuration URL"
                  placeholder="https://example.com/session-config.json"
                  value={jsonFileUrl}
                  onChange={(e) => setJsonFileUrl(e.target.value)}
                  error={errors.jsonFileUrl}
                  icon={<LinkIcon className="w-4 h-4" />}
                  required
                />
                <p className="mt-1 text-xs text-wellness-secondary">
                  URL to your wellness session JSON configuration file.
                </p>
              </div>

              {/* Auto-save Status */}
              {lastSavedAt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs text-wellness-secondary bg-green-50 p-3 rounded-lg border border-green-200"
                >
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>Last auto-saved: {formatTimestamp(lastSavedAt)}</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                  className="flex-1 justify-center"
                >
                  Save Draft
                </Button>
                
                <Button
                  type="button"
                  variant="primary"
                  onClick={handlePublish}
                  loading={isPublishing}
                  icon={<CheckCircle className="w-4 h-4" />}
                  className="flex-1 justify-center"
                  disabled={!title.trim() || !jsonFileUrl.trim()}
                >
                  {isEditing ? 'Update & Publish' : 'Publish Session'}
                </Button>
              </div>

              {/* Help Text */}
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h4 className="text-sm font-medium text-primary-800 mb-2">
                  💡 Tips for creating great sessions:
                </h4>
                <ul className="text-xs text-primary-700 space-y-1">
                  <li>• Use descriptive titles that clearly indicate the session purpose</li>
                  <li>• Add relevant tags to help others find your session</li>
                  <li>• Ensure your JSON URL is publicly accessible</li>
                  <li>• Test your configuration before publishing</li>
                  <li>• Changes are auto-saved every 5 seconds while you type</li>
                </ul>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Editor;


