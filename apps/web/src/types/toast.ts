import type * as React from "react";

/**
 * Defines the shape of a toast action element.
 */
export type ToastActionElement = React.ReactElement;

/**
 * Defines the base props for a toast.
 */
export type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Defines the shape of a single toast object used within our toast system.
 */
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * Defines the shape of the entire state managed by the toast store.
 */
export interface ToastState {
  toasts: ToasterToast[];
}

/**
 * Defines all possible actions that can be dispatched to the toast reducer.
 */
export const toastActionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof toastActionTypes;

export type ToastAction =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] };
