"use client";

import { useEffect, useState } from "react";

export interface UseTypingEffectOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

interface UseTypingEffectReturn {
  text: string;
  isDeleting: boolean;
  currentIndex: number;
}

export function useTypingEffect({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  loop = true,
}: UseTypingEffectOptions): UseTypingEffectReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);

          if (loop) {
            setCurrentIndex((prev) => (prev + 1) % words.length);
          } else if (currentIndex < words.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    deletingSpeed,
    isDeleting,
    loop,
    pauseDuration,
    text,
    typingSpeed,
    words,
  ]);

  return {
    text,
    isDeleting,
    currentIndex,
  };
}