"use client";

export function GridPattern() {
  return (
    <div
      className="
        absolute
        inset-0
        opacity-[0.05]
        [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]
        [background-size:40px_40px]
      "
    />
  );
}