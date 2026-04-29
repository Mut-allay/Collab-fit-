import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "./DashboardPage";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockUseDashboardData = vi.fn();
vi.mock("@/hooks/useDashboardData", () => ({
  useDashboardData: () => mockUseDashboardData(),
}));

const mockUseAuth = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("📊 DashboardPage - User Home Screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: "test-user-123",
        displayName: "Test User",
        email: "test@example.com",
        emailVerified: true,
      },
      userProfile: {
        uid: "test-user-123",
        displayName: "Test User",
        email: "test@example.com",
      },
      loading: false,
      sessionExpiry: null,
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
    });
  });

  it("should render dashboard greeting when data is loaded", () => {
    mockUseDashboardData.mockReturnValue({
      selectedPlan: null,
      todaysWorkout: null,
      weeklyProgress: [],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/^Test$/)).toBeInTheDocument();
  });

  it("should show loading state when data is fetching", () => {
    mockUseDashboardData.mockReturnValue({
      selectedPlan: null,
      todaysWorkout: null,
      weeklyProgress: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
