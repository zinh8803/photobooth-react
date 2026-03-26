import { useReducer, useCallback } from 'react';
import { PhotoBoothState, FrameTemplate, FilterType, CapturedPhoto } from '../types';

type Action =
  | { type: 'SELECT_FRAME'; payload: FrameTemplate }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'ADD_PHOTO'; payload: CapturedPhoto }
  | { type: 'REMOVE_PHOTO'; payload: string }
  | { type: 'SET_COUNTDOWN'; payload: number | null }
  | { type: 'SET_CAPTURING'; payload: boolean }
  | { type: 'SET_STEP'; payload: PhotoBoothState['step'] }
  | { type: 'SET_FINAL_IMAGE'; payload: string | null }
  | { type: 'RESET' };

const initialState: PhotoBoothState = {
  step: 'select-frame',
  selectedFrame: null,
  capturedPhotos: [],
  currentFilter: 'none',
  countdown: null,
  isCapturing: false,
  finalImageUrl: null,
};

function reducer(state: PhotoBoothState, action: Action): PhotoBoothState {
  switch (action.type) {
    case 'SELECT_FRAME':
      return {
        ...state,
        selectedFrame: action.payload,
        capturedPhotos: [],
        step: 'capture',
      };
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    case 'ADD_PHOTO':
      return {
        ...state,
        capturedPhotos: [...state.capturedPhotos, action.payload],
      };
    case 'REMOVE_PHOTO':
      return {
        ...state,
        capturedPhotos: state.capturedPhotos.filter((p) => p.id !== action.payload),
      };
    case 'SET_COUNTDOWN':
      return { ...state, countdown: action.payload };
    case 'SET_CAPTURING':
      return { ...state, isCapturing: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_FINAL_IMAGE':
      return { ...state, finalImageUrl: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function usePhotoBoothState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectFrame = useCallback((frame: FrameTemplate) => {
    dispatch({ type: 'SELECT_FRAME', payload: frame });
  }, []);

  const setFilter = useCallback((filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const addPhoto = useCallback((photo: CapturedPhoto) => {
    dispatch({ type: 'ADD_PHOTO', payload: photo });
  }, []);

  const removePhoto = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: id });
  }, []);

  const setCountdown = useCallback((count: number | null) => {
    dispatch({ type: 'SET_COUNTDOWN', payload: count });
  }, []);

  const setCapturing = useCallback((capturing: boolean) => {
    dispatch({ type: 'SET_CAPTURING', payload: capturing });
  }, []);

  const setStep = useCallback((step: PhotoBoothState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setFinalImage = useCallback((url: string | null) => {
    dispatch({ type: 'SET_FINAL_IMAGE', payload: url });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    selectFrame,
    setFilter,
    addPhoto,
    removePhoto,
    setCountdown,
    setCapturing,
    setStep,
    setFinalImage,
    reset,
  };
}
