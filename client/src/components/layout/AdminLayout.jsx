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
        <div className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E8E3] sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5F6B63]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[#E2E8E3] bg-[#F7F9F7] focus:bg-white focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] transition-all duration-200 outline-none w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-[#5F6B63] hover:bg-[#F1F4F1] hover:text-[#2C2C2C] transition-all duration-200 relative">
              {/* <FiBell className="w-5 h-5" /> */}
            </button>

            <button className="flex items-center gap-2 p-2 rounded-xl text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200 relative">
              <div className="w-8 h-8 rounded-full bg-[#8FAF9A]/10 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-[#8FAF9A]" />
                <span className="absolute top-3 left-1 w-2 h-2 bg-[#2E8B57] rounded-full"></span>
              </div>
              <span className="text-sm font-medium text-[#2C2C2C] hidden lg:inline">
                Mr. Naja
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
