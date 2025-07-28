import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
    it('should render the spinner element', () => {
        render(<LoadingSpinner />);

        // Check if the spinning animation element is present
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('should display the provided message', () => {
        const message = "Loading data...";
        render(<LoadingSpinner message={message} />);

        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should not render a message if none is provided', () => {
        render(<LoadingSpinner />);

        // queryByText is used to check for something that should NOT be there
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        const customClass = "custom-loading-class";
        render(<LoadingSpinner className={customClass} />);

        const container = document.querySelector(`.${customClass}`);
        expect(container).toBeInTheDocument();
    });

    it('should have the correct default styling', () => {
        render(<LoadingSpinner />);

        const container = document.querySelector('.flex.items-center.justify-center.min-h-screen');
        expect(container).toBeInTheDocument();
    });

    it('should render spinner with correct styling', () => {
        render(<LoadingSpinner />);

        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-spark-500', 'mx-auto');
    });
}); 