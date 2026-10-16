"use client";

import type { ComponentPropsWithoutRef } from "react";
import { track } from "@/lib/analytics";

/** Anchor that fires `booking_click` (no personal data). */
export default function TrackBookingLink({
  onClick,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track("booking_click");
        onClick?.(e);
      }}
    />
  );
}
