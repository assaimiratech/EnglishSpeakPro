import { useState } from "react";
import { FiMenu, FiBell, FiUser, FiSearch } from "react-icons/fi";
import AdminSidebar from "../admin/AdminSidebar";
import MobileSidebar from "../admin/MobileSidebar";

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex">
      <AdminSidebar />
      <MobileSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Topbar */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-[#E2E8E3] shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl text-[#5F6B63] hover:bg-[#F1F4F1] hover:text-[#2C2C2C] transition-all duration-200"
              aria-label="Open menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8FAF9A]/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-[#8FAF9A]">ES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Topbar (Optional) */}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
