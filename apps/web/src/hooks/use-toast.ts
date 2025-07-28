import * as React from "react";
import { store } from "@/lib/toastStore";
import type { ToastState as State, ToasterToast } from "@/types/toast";

// --- IMPERATIVE API ---
// This function can be called from anywhere in the app (e.g., services, API calls).
// It's the primary way to create a new toast.

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Toast = Omit<ToasterToast, "id">;

export function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) => store.updateToast({ ...props, id });

  const dismiss = () => store.dismissToast(id);

  store.addToast({
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss();
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// --- REACT HOOK ---
// This hook connects React components to our toast store, so they re-render when toasts change.
export function useToast() {
  // Get the initial state from the store
  const [state, setState] = React.useState<State>(store.getState());

  React.useEffect(() => {
    // When the component mounts, subscribe to store changes.
    // The subscribe function returns an `unsubscribe` function for cleanup.
    const unsubscribe = store.subscribe(setState);

    // When the component unmounts, unsubscribe to prevent memory leaks.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once.

  return {
    ...state,
    toast,
    dismiss: store.dismissToast,
  };
}
