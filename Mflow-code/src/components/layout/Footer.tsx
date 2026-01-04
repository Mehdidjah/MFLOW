import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <span>Created by </span>
            <span className="font-semibold text-foreground">Mehdi</span>
          </div>

          <a
            href="https://github.com/Mehdidjah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MFlow
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
