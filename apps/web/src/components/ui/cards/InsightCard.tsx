import type { ReactNode } from "react";

import { BaseCard } from "./BaseCard";

interface InsightCardProps {

  title: string;

  children: ReactNode;

}

export function InsightCard({

  title,

  children,

}: InsightCardProps) {

  return (

    <BaseCard title={title}>

      {children}

    </BaseCard>

  );

}