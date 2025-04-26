import Image from "next/image";

export function Cat() {
  return (
    <Image
      src="/olivia.png"
      width="106"
      height="139"
      alt="olivia-cat"
      className="z-30"
    />
  );
}
