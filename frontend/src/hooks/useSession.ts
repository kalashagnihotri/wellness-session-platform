import { useState, useEffect } from 'react';
import { sessionAPI } from '../services/api';

interface Session {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSession = (id?: string): UseSessionReturn => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    if (!id) {
      setSession(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sessionAPI.getSessionById(id);
      if (response.success && response.data) {
        setSession(response.data);
      } else {
        setError('Session not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
  };
};
