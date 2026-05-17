import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif m-0 mb-2">Page not found</h1>
      <p className="text-sm sm:text-base text-slate dark:text-mist mb-6">
        That URL doesn't match anything in the app. The constitution you're
        looking for might be one click away in the Explorer.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link to="/explorer">
          <Button className="w-full sm:w-auto">Browse constitutions</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" className="w-full sm:w-auto">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
