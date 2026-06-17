import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-display font-bold">
              War<span className="text-destructive">Impact</span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              Visualizing the economic toll of global conflicts.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-muted-foreground md:mt-0 mt-8">
            &copy; {new Date().getFullYear()} War Economic Impact Dataset. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
