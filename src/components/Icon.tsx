"use client";

interface IconProps {
  name: string;
  fill?: 0 | 1;
  size?: number;
  className?: string;
}

export default function Icon({ name, fill = 0, size = 24, className = "" }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill},'wght' 400,'GRAD' 0,'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
