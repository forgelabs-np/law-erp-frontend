export type SidebarItemProps = {
  name: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: SidebarItemProps[];
  isChild?: boolean;
  isActive?: boolean;
};
