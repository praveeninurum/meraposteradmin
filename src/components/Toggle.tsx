"use client";

interface ToggleProps {
  on: boolean;
  onChange: (val: boolean) => void;
}

export default function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full relative transition-colors ${on ? "toggle-on" : "toggle-off"}`}
      aria-checked={on}
      role="switch"
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "right-0.5" : "left-0.5"}`}
      />
    </button>
  );
}
