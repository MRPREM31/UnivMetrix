import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <div className="text-4xl font-extrabold font-mono text-gold-500">404</div>
        <h2 className="text-xl font-bold text-text-primary">Page Not Found</h2>
        <p className="text-xs text-text-muted">
          The requested route does not exist or has moved. Explore precious metals pricing on our overview dashboard.
        </p>
        <div className="pt-2 flex justify-center">
          <Link to="/">
            <Button variant="gold" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Overview</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
