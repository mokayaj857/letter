import { icons } from "@/assets/icons";

/** Small clay coin image used instead of an emoji. */
export function Coin({ className = "size-4" }: { className?: string }) {
  return (
    <img
      src={icons.coin}
      alt=""
      aria-hidden
      loading="lazy"
      width={384}
      height={384}
      className={`${className} inline-block object-contain`}
    />
  );
}
