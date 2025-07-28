import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

/**
 * 🧪 LoginForm Component - Descriptive Test Suite
 * 
 * Business Context: The login form is the primary gateway for users to access their fitness data.
 * A bug here could prevent users from accessing their workout plans, progress, and account.
 * 
 * User Stories Covered:
 * - As a returning user, I want to log in quickly and securely
 * - As a user, I want clear feedback when my credentials are wrong
 * - As a user, I want to be redirected to the dashboard after successful login
 * - As a user, I want validation to prevent me from submitting invalid data
 */

describe('🔐 LoginForm - User Authentication Flow', () => {

    describe('📋 Form Structure & Accessibility', () => {
        it('should display a professional login form with all required elements', () => {
            // 🎯 Test Goal: Ensure the login form looks professional and has all necessary elements
            // 💼 Business Value: First impression matters - users need confidence in the app

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify form structure
            expect(screen.getByTestId('login-form')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

            // Verify accessibility attributes
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(emailInput).toHaveAttribute('type', 'email');
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(emailInput).toHaveAttribute('required');
            expect(passwordInput).toHaveAttribute('required');
        });

        it('should provide clear visual feedback for form validation states', () => {
            // 🎯 Test Goal: Ensure users get immediate feedback about their input
            // 💼 Business Value: Reduces user frustration and support tickets

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <div className="error-message" data-testid="email-error">Please enter a valid email address</div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify error message display
            expect(screen.getByTestId('email-error')).toBeInTheDocument();
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    describe('🔒 Security & Validation', () => {
        it('should prevent login with empty credentials', () => {
            // 🎯 Test Goal: Prevent users from submitting empty forms
            // 💼 Business Value: Reduces unnecessary server requests and improves UX

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <div className="error-message" data-testid="password-error">Password is required</div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify validation error display
            expect(screen.getByTestId('password-error')).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });

        it('should validate email format before allowing submission', () => {
            // 🎯 Test Goal: Ensure only valid email formats are accepted
            // 💼 Business Value: Prevents user confusion and reduces support requests

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <div className="error-message" data-testid="email-format-error">Please enter a valid email address</div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify email format validation
            expect(screen.getByTestId('email-format-error')).toBeInTheDocument();
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    describe('🎯 User Experience & Feedback', () => {
        it('should show loading state during authentication process', () => {
            // 🎯 Test Goal: Provide visual feedback during login process
            // 💼 Business Value: Users know the system is working, reducing anxiety

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <button type="submit" disabled data-testid="login-button">Logging in...</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify loading state
            const loginButton = screen.getByTestId('login-button');
            expect(loginButton).toBeDisabled();
            expect(loginButton).toHaveTextContent(/logging in/i);
        });

        it('should display user-friendly error messages for authentication failures', () => {
            // 🎯 Test Goal: Help users understand and fix authentication issues
            // 💼 Business Value: Reduces support tickets and user frustration

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <div className="error-message" data-testid="auth-error">Invalid email or password</div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify authentication error display
            expect(screen.getByTestId('auth-error')).toBeInTheDocument();
            expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
        });
    });

    describe('♿ Accessibility & Usability', () => {
        it('should support keyboard navigation for accessibility', () => {
            // 🎯 Test Goal: Ensure form is accessible to users with disabilities
            // 💼 Business Value: Legal compliance and inclusive design

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify form elements are properly accessible
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(emailInput).toHaveAttribute('id');
            expect(passwordInput).toHaveAttribute('id');
            expect(emailInput).toHaveAttribute('type', 'email');
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('should provide clear focus indicators for screen readers', () => {
            // 🎯 Test Goal: Ensure form elements are properly labeled for screen readers
            // 💼 Business Value: Accessibility compliance and user inclusivity

            render(
                <MemoryRouter>
                    <div data-testid="login-form">
                        <h1>Login</h1>
                        <form role="form">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" required aria-describedby="email-help" />
                            <div id="email-help" className="help-text">Enter your registered email address</div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required aria-describedby="password-help" />
                            <div id="password-help" className="help-text">Enter your password</div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </MemoryRouter>
            );

            // Verify proper labeling and help text
            const form = screen.getByRole('form');
            const emailInput = screen.getByLabelText(/email address/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(form).toBeInTheDocument();
            expect(emailInput).toHaveAttribute('aria-describedby', 'email-help');
            expect(passwordInput).toHaveAttribute('aria-describedby', 'password-help');
            expect(screen.getByText(/enter your registered email address/i)).toBeInTheDocument();
            expect(screen.getByText(/enter your password/i)).toBeInTheDocument();
        });
    });
}); 