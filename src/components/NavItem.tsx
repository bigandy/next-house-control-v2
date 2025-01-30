"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-lg font-bold hover:underline ${
        isActive ? "underline" : ""
      }`}
    >
      {label}
    </Link>
  );
}
