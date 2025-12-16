import { FaChevronDown } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

export default function FilterSection({
  filter,
  setFilter,
  isOpen = true,
  onClose,
}: {
  filter: string;
  setFilter: (filter: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Filter Content */}
      <aside
        className={`
          w-full not-md:px-4 rounded-2xl text-foreground bg-background py-6 md:static md:transform-none md:opacity-100 fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
          } max-h-[80vh] overflow-y-auto
        `}
      >
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">ফিল্টার</h2>
          <button
            onClick={onClose}
            className="md:hidden text-foreground hover:opacity-70 transition-opacity"
            aria-label="Close filter"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mb-6 relative">
          <select
            className="w-full appearance-none bg-background px-4 py-2 rounded-full border border-foreground text-foreground text-sm outline-none pr-10 transition-all duration-200 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>সব বিষয়</option>
            <option>ডিজাইন</option>
            <option>ডেভেলপমেন্ট</option>
            <option>মার্কেটিং</option>
          </select>

          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground pointer-events-none" />
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-sm">ফি টাইপ</h3>
          {['ফ্রি', 'পেইড'].map((fee) => (
            <label key={fee} className="flex items-center gap-2 mb-2 text-sm">
              <input type="checkbox" className="accent-blue-500" />
              {fee}
            </label>
          ))}
        </div>
      </aside>
    </>
  );
}
