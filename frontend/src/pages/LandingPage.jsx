import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>War Economic Impact | Home</title>
        <meta name="description" content="Explore the devastating economic impact of wars and conflicts globally." />
      </Helmet>
      
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center pt-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          War <span className="text-destructive">Economic</span> Impact
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
          A comprehensive analysis of the financial devastation, reconstruction costs, and human toll of global conflicts.
        </p>
        <div className="flex gap-4">
          <Link to="/dashboard" className="px-8 py-3 bg-primary text-primary-foreground rounded-radius font-medium hover:opacity-90 transition-opacity">
            Explore Dashboard
          </Link>
          <Link to="/dashboard/conflicts" className="px-8 py-3 bg-secondary text-secondary-foreground rounded-radius font-medium hover:opacity-90 transition-opacity">
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
