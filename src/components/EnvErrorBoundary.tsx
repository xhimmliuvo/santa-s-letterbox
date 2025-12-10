import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class EnvErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#1a1a2e',
          color: '#fff',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ff6b6b' }}>
            Configuration Error
          </h1>
          <p style={{ fontSize: '16px', marginBottom: '24px', maxWidth: '500px', color: '#ccc' }}>
            The application is missing required environment variables.
          </p>
          <div style={{
            backgroundColor: '#2d2d44',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%'
          }}>
            <p style={{ fontSize: '14px', marginBottom: '12px', color: '#aaa' }}>
              Please ensure these variables are set in Netlify:
            </p>
            <code style={{
              display: 'block',
              backgroundColor: '#1a1a2e',
              padding: '12px',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#4ade80'
            }}>
              VITE_SUPABASE_URL<br />
              VITE_SUPABASE_PUBLISHABLE_KEY
            </code>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
