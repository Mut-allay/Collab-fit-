import type { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useWorkoutSession } from "./useWorkoutSession";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "u1", displayName: "Tester" },
    userProfile: null,
    loading: false,
    sessionExpiry: null,
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    updateUserProfile: vi.fn(),
  }),
}));

const { mockGetDoc } = vi.hoisted(() => ({
  mockGetDoc: vi.fn(),
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    doc: vi.fn((...args: unknown[]) => {
      const segments = args.slice(1) as string[];
      return { path: segments.join("/") };
    }),
    getDoc: (ref: unknown) => mockGetDoc(ref),
  };
});

function hookWrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={["/workout/plan1/phase1"]}>
      <Routes>
        <Route path="/workout/:planId/:phaseId" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("💪 useWorkoutSession Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDoc.mockImplementation((ref: { path?: string }) => {
      const path = ref?.path ?? "";
      if (path.includes("workoutPrograms")) {
        return Promise.resolve({
          exists: () => true,
          id: "plan1",
          data: () => ({
            phases: [
              {
                id: "phase1",
                name: "Phase 1",
                exercises: [{ exerciseId: "ex1", sets: 3 }],
              },
            ],
          }),
        });
      }
      if (path.includes("exercises")) {
        return Promise.resolve({
          exists: () => true,
          id: "ex1",
          data: () => ({ name: "Squat" }),
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  });

  it("should finish loading after plan resolves", async () => {
    const { result } = renderHook(() => useWorkoutSession(), {
      wrapper: hookWrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should log a set and update state when inputs are valid", async () => {
    const { result } = renderHook(() => useWorkoutSession(), {
      wrapper: hookWrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.setCurrentWeight("50");
      result.current.setCurrentReps("10");
    });

    await act(async () => {
      result.current.logSet();
    });

    expect(result.current.setLogs.length).toBeGreaterThan(0);
  });
});
