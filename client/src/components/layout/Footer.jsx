const Footer = () => {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} EnglishSpeakPro. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
