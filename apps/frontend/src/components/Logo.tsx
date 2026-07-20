"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: 32,
  md: 44,
  lg: 140,
} as const;

export default function Logo({
  size = "md",
  animate = false,
  href = "/",
  className,
}: {
  size?: keyof typeof SIZES;
  animate?: boolean;
  href?: string | null;
  className?: string;
}) {
  const px = SIZES[size];

  const image = (
    <Image
      src="/logo.png"
      alt="MIJOE SevisPass"
      width={px}
      height={px}
      priority
      className={cn("shrink-0 object-contain", animate && "logo-fly-in", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="shrink-0">
      {image}
    </Link>
  );
}
