import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useWorkoutSession } from "./useWorkoutSession";

vi.mock("firebase/firestore");

describe("💪 useWorkoutSession Hook", () => {
  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useWorkoutSession());
    expect(result.current.loading).toBe(true);
  });

  it("should log a set and update state", async () => {
    const { result } = renderHook(() => useWorkoutSession());
    await act(async () => {
      result.current.logSet();
    });
    expect(result.current.setLogs.length).toBeGreaterThan(0);
  });
});
