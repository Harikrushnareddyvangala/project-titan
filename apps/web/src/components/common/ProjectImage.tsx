"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager" | "auto";
}

export function ProjectImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
}: Props) {
  const [image, setImage] = useState(src);

  return (
    <Image
      src={image}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={() => {
        setImage("/projects/placeholder-project.png");
      }}
    />
  );
}