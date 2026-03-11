'use client';

export default function EmailForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex gap-0 max-w-sm">
      <input
        type="email"
        placeholder="Email Address"
        className="flex-1 border border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="bg-black text-white text-xs font-bold uppercase px-4 py-2 hover:bg-gray-900 transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
}
