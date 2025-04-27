import Image from "next/image";

export function Cat({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Image
      src="/olivia.png"
      width="106"
      height="139"
      alt="olivia-cat"
      className={`z-30 ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    />
  );
}
