export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

export interface NavbarProps {
  className?: string;
}