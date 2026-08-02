import type { ReactNode } from "react";

import { BaseCard } from "./BaseCard";

import { StatusBadge } from "../badges/StatusBadge";

import type {
  BadgeVariant,
} from "../badges/StatusBadge";

interface StatusCardProps {

  title: string;

  status: string;

  variant: BadgeVariant;

  children?: ReactNode;

}

export function StatusCard({

  title,

  status,

  variant,

  children,

}: StatusCardProps) {

  return (

    <BaseCard>

      <div className="flex items-center justify-between">

        <h3 className="font-semibold">

          {title}

        </h3>

        <StatusBadge
          variant={variant}
        >

          {status}

        </StatusBadge>

      </div>

      {children && (

        <div className="mt-5">

          {children}

        </div>

      )}

    </BaseCard>

  );

}