import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = ({ children, noPadding = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)] text-[var(--text)]">
      {/* HEADER */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className={`flex-1 ${!noPadding ? "py-8 md:py-12 lg:py-16" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AppLayout;
