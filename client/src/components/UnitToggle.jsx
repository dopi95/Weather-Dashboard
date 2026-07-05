/**
 * UnitToggle.jsx
 * Toggle between °C and °F. Conversion is pure frontend math — no re-fetch.
 */

/**
 * @param {{
 *   unit: 'C'|'F',
 *   onToggle: () => void,
 * }} props
 */
export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
      title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
      className="
        px-3 py-1.5 rounded-xl text-sm font-semibold
        bg-white/20 hover:bg-white/35 text-white
        focus:outline-none focus:ring-2 focus:ring-white/60
        transition select-none
      "
    >
      {unit === 'C' ? '°C → °F' : '°F → °C'}
    </button>
  );
}
