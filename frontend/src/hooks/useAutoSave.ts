import { useEffect, useRef, useCallback } from 'react';
import { sessionAPI } from '../services/api';
import { toast } from 'react-toastify';

interface AutoSaveData {
  id?: string;
  title: string;
  tags: string[];
  json_file_url: string;
}

interface UseAutoSaveOptions {
  data: AutoSaveData;
  debounceDelay?: number;
  backupInterval?: number;
  onSaveSuccess?: (timestamp: Date) => void;
  onSaveError?: (error: any) => void;
}

const useAutoSave = ({
  data,
  debounceDelay = 5000, // 5 seconds
  backupInterval = 30000, // 30 seconds
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) => {
  const debounceTimer = useRef<number | undefined>(undefined);
  const backupTimer = useRef<number | undefined>(undefined);
  const lastSavedData = useRef<string>('');
  const isSaving = useRef<boolean>(false);

  const saveDraft = useCallback(async (showToast = true) => {
    // Don't save if title is empty or if we're already saving
    if (!data.title.trim() || isSaving.current) {
      return;
    }

    const currentDataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentDataString === lastSavedData.current) {
      return;
    }

    try {
      isSaving.current = true;
      const response = await sessionAPI.saveDraftSession(data);
      
      if (response.success) {
        lastSavedData.current = currentDataString;
        const timestamp = new Date();
        
        if (showToast) {
          toast.success('Draft auto-saved successfully ✅', {
            position: 'bottom-right',
            autoClose: 2000,
          });
        }
        
        onSaveSuccess?.(timestamp);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (showToast) {
        toast.error('Failed to auto-save draft ❌', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
      onSaveError?.(error);
    } finally {
      isSaving.current = false;
    }
  }, [data, onSaveSuccess, onSaveError]);

  // Debounced auto-save (triggered by user activity)
  useEffect(() => {
    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      saveDraft(true);
    }, debounceDelay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data.title, data.tags, data.json_file_url, debounceDelay, saveDraft]);

  // Backup interval auto-save (runs regardless of activity)
  useEffect(() => {
    backupTimer.current = setInterval(() => {
      saveDraft(false); // Don't show toast for backup saves
    }, backupInterval);

    return () => {
      if (backupTimer.current) {
        clearInterval(backupTimer.current);
      }
    };
  }, [backupInterval, saveDraft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (backupTimer.current) {
        clearInterval(backupTimer.current);
      }
    };
  }, []);

  // Manual save function
  const manualSave = useCallback(() => {
    return saveDraft(true);
  }, [saveDraft]);

  return {
    manualSave,
    isSaving: isSaving.current,
  };
};

export default useAutoSave;
