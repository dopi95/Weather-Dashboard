export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
      className="
        relative flex items-center glass-light rounded-full p-1 shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-400/60
        transition select-none shrink-0
      "
    >
      {['C', 'F'].map((u) => (
        <span
          key={u}
          className={`
            px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-250
            ${unit === u
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700'
            }
          `}
        >
          °{u}
        </span>
      ))}
    </button>
  );
}
