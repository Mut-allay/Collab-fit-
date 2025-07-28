import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardPage from './DashboardPage';
import { renderWithAuth, authTestScenarios } from '@/test-utils/auth-test-utils';

describe('📊 DashboardPage - User Home Screen', () => {
    it('should render dashboard with user greeting when authenticated', () => {
        // 🎯 Test Goal: Ensure dashboard renders for logged-in users
        // 💼 Business Value: Confirms core user interface loads properly
        renderWithAuth(<DashboardPage />, { authState: authTestScenarios.authenticated });
        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    it('should show loading state when data is fetching', () => {
        renderWithAuth(<DashboardPage />, { authState: authTestScenarios.loading });
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
}); 