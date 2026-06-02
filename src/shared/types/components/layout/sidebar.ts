export type SidebarItemProps = {
  name: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: SidebarItemProps[];
  isChild?: boolean;
  isActive?: boolean;
  section?: string;
};

export type SidebarSectionProps = {
  title: string;
  items: React.ReactNode[];
};
