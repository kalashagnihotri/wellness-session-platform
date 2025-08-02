import { useState, useEffect, useCallback } from 'react';
import { sessionAPI } from '../services/api';
import { toast } from 'react-toastify';

interface Session {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

interface PublicSessionsResponse {
  success: boolean;
  data: {
    sessions: Session[];
    totalPages: number;
    currentPage: number;
    totalSessions: number;
  };
}

interface MySessionsResponse {
  success: boolean;
  data: {
    drafts: Session[];
    published: Session[];
  };
}

export const usePublicSessions = (page = 1, limit = 10) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalSessions: 0,
  });

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PublicSessionsResponse = await sessionAPI.getPublicSessions(page, limit);
      
      if (response.success) {
        setSessions(response.data.sessions);
        setPagination({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          totalSessions: response.data.totalSessions,
        });
      } else {
        setError('Failed to fetch sessions');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const refetch = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useMySessions = () => {
  const [drafts, setDrafts] = useState<Session[]>([]);
  const [published, setPublished] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMySessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: MySessionsResponse = await sessionAPI.getMySessions();
      
      if (response.success) {
        setDrafts(response.data.drafts);
        setPublished(response.data.published);
      } else {
        setError('Failed to fetch your sessions');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your sessions');
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMySessions();
  }, [fetchMySessions]);

  const publishSession = useCallback(async (id: string) => {
    try {
      const response = await sessionAPI.publishSession(id);
      if (response.success) {
        toast.success('Session published successfully!');
        // Move session from drafts to published
        const sessionToMove = drafts.find(session => session._id === id);
        if (sessionToMove) {
          setDrafts(prev => prev.filter(session => session._id !== id));
          setPublished(prev => [...prev, { ...sessionToMove, status: 'published' }]);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish session');
    }
  }, [drafts]);

  const deleteSession = useCallback(async (id: string, status: 'draft' | 'published') => {
    try {
      const response = await sessionAPI.deleteSession(id);
      if (response.success) {
        toast.success('Session deleted successfully');
        if (status === 'draft') {
          setDrafts(prev => prev.filter(session => session._id !== id));
        } else {
          setPublished(prev => prev.filter(session => session._id !== id));
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete session');
    }
  }, []);

  const refetch = useCallback(() => {
    fetchMySessions();
  }, [fetchMySessions]);

  return {
    drafts,
    published,
    loading,
    error,
    publishSession,
    deleteSession,
    refetch,
  };
};

export const useSession = (id?: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getSessionById(id);
      
      if (response.success) {
        setSession(response.data);
      } else {
        setError('Session not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch session');
      toast.error('Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [fetchSession, id]);

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
  };
};
