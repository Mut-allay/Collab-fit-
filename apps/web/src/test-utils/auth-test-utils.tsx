import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock Firebase Auth
export const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
} as any;

export const mockUserProfile = {
    uid: 'test-user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
        theme: 'light',
        notifications: true,
    },
};

// Mock auth functions
export const mockAuthFunctions = {
    login: vi.fn().mockResolvedValue(undefined),
    signup: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    updateUserProfile: vi.fn().mockResolvedValue(undefined),
};

// Custom render function with auth context
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    authState?: {
        currentUser?: any;
        userProfile?: any;
        loading?: boolean;
    };
    route?: string;
}

export function renderWithAuth(
    ui: React.ReactElement,
    options: CustomRenderOptions = {}
) {
    const {
        authState = {
            currentUser: mockUser,
            userProfile: mockUserProfile,
            loading: false,
        },
        route = '/',
        ...renderOptions
    } = options;

    // Create a mock useAuth function that returns the provided auth state
    const mockUseAuth = vi.fn(() => ({
        currentUser: authState.currentUser,
        userProfile: authState.userProfile,
        loading: authState.loading,
        ...mockAuthFunctions,
    }));

    // Mock the AuthContext
    vi.mock('@/contexts/AuthContext', () => ({
        useAuth: mockUseAuth,
        AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={[route]}>
            {children}
        </MemoryRouter>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Test scenarios
export const authTestScenarios = {
    // Authenticated user
    authenticated: {
        currentUser: mockUser,
        userProfile: mockUserProfile,
        loading: false,
    },

    // Unauthenticated user
    unauthenticated: {
        currentUser: null,
        userProfile: null,
        loading: false,
    },

    // Loading state
    loading: {
        currentUser: null,
        userProfile: null,
        loading: true,
    },

    // User without profile
    noProfile: {
        currentUser: mockUser,
        userProfile: null,
        loading: false,
    },
};

// Helper to test protected routes
export function renderProtectedComponent(
    component: React.ReactElement,
    isAuthenticated = true
) {
    return renderWithAuth(component, {
        authState: isAuthenticated ? authTestScenarios.authenticated : authTestScenarios.unauthenticated,
    });
}

// Helper to test loading states
export function renderWithLoadingState(component: React.ReactElement) {
    return renderWithAuth(component, {
        authState: authTestScenarios.loading,
    });
} 