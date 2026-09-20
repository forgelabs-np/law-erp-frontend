export type SidebarItemProps = {
  name: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: SidebarItemProps[];
  isChild?: boolean;
  isActive?: boolean;
  section?: string;
  moduleCode?: string;
  onClick?: () => void;
  badge?: number | string;
};

export type SidebarSectionProps = {
  title: string;
  items: React.ReactNode[];
};
