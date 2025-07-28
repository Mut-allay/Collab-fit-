import {
  type ToasterToast,
  type ToastState as State,
  type ToastAction as Action,
  toastActionTypes,
} from "@/types/toast";

// --- CONFIGURATION ---
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// --- STATE MANAGEMENT CORE ---
let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case toastActionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case toastActionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case toastActionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    case toastActionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// --- SIDE EFFECT MANAGEMENT ---
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: toastActionTypes.REMOVE_TOAST, toastId: toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

// --- PUBLIC API for the Store ---
export const store = {
  getState: () => memoryState,
  subscribe: (listener: (state: State) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },
  addToast: (toast: ToasterToast) =>
    dispatch({ type: toastActionTypes.ADD_TOAST, toast }),
  updateToast: (toast: Partial<ToasterToast>) =>
    dispatch({ type: toastActionTypes.UPDATE_TOAST, toast }),
  dismissToast: (toastId?: string) => {
    dispatch({ type: toastActionTypes.DISMISS_TOAST, toastId });
    if (toastId) {
      addToRemoveQueue(toastId);
    } else {
      memoryState.toasts.forEach((toast) => addToRemoveQueue(toast.id));
    }
  },
};
