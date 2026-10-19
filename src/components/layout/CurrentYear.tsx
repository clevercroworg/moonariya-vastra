"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The year is read on the client only: Cache Components forbids `new Date()`
// while prerendering, so the server snapshot is empty.
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
