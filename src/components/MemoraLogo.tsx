import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MemoraLogoProps = {
  className?: string;
  variant?: "navbar" | "hero";
  /** Sem link (útil quando o ícone fica dentro de um `<Link>` com o texto). */
  href?: string | null;
  /** Só o ícone ao lado do texto: alt vazio para não repetir “Memora” no leitor de tela. */
  iconOnly?: boolean;
};

/** PNG do ícone em `public/memora-logo.png`. */
export function MemoraLogo({
  className,
  variant = "navbar",
  href = "/",
  iconOnly = false,
}: MemoraLogoProps) {
  const isNav = variant === "navbar";

  const sizePx = isNav ? 40 : 72;
  const image = (
    <Image
      src="/memora-logo.png"
      alt={iconOnly ? "" : "Memora"}
      width={sizePx}
      height={sizePx}
      priority={isNav}
      className={cn(
        "object-contain",
        isNav ? "h-9 w-9 sm:h-10 sm:w-10" : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
      )}
      sizes={isNav ? "40px" : "(max-width: 640px) 64px, 72px"}
    />
  );

  if (href === null) {
    return (
      <span className={cn("inline-flex shrink-0 items-center justify-center", className)}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.09_0.035_250)]",
        className
      )}
      aria-label="Memora — início"
    >
      {image}
    </Link>
  );
}
