/**
 * @fileoverview Robust React Error Boundary with Diagnostics and Restart
 */
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error captured by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-container" role="alert">
          <div className="error-fallback-card">
            <span className="error-fallback-icon">⚠️</span>
            <h2>CONSOLE KERNEL EXCEPTION</h2>
            <p>An unexpected runtime fault occurred in the rendering pipeline.</p>
            <div className="error-fallback-details">
              <code>{this.state.error?.message || 'Unknown runtime error'}</code>
            </div>
            <div className="error-fallback-actions">
              <button type="button" className="ps-btn ps-btn-primary" onClick={this.handleReset}>
                RECOVER RUNTIME
              </button>
              <button type="button" className="ps-btn ps-btn-secondary" onClick={this.handleReload}>
                REBOOT CONSOLE
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

