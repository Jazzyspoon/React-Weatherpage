import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  test('renders with default props', () => {
    render(<ErrorMessage />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  test('renders with custom title and message', () => {
    render(
      <ErrorMessage 
        title="Custom Error" 
        message="This is a custom error message" 
      />
    );
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('This is a custom error message')).toBeInTheDocument();
  });

  test('renders retry button when onRetry provided', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test('renders different types with correct icons', () => {
    const { rerender } = render(<ErrorMessage type="warning" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();

    rerender(<ErrorMessage type="info" />);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();

    rerender(<ErrorMessage type="error" />);
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  test('hides icon when showIcon is false', () => {
    render(<ErrorMessage showIcon={false} />);
    
    expect(screen.queryByText('❌')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<ErrorMessage className="custom-error" />);
    
    expect(document.querySelector('.custom-error')).toBeInTheDocument();
  });
});
