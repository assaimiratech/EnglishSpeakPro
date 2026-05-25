import { FiGrid } from "react-icons/fi";

const AdminHeader = ({ title }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 flex items-center justify-center">
          <FiGrid className="w-5 h-5 text-[#8FAF9A]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] tracking-tight">
          {title}
        </h1>
      </div>

      <div className="w-12 h-0.5 bg-[#8FAF9A] rounded-full mb-3"></div>

      <p className="text-sm text-[#5F6B63] leading-relaxed">
        Manage your platform efficiently
      </p>
    </div>
  );
};

export default AdminHeader;
