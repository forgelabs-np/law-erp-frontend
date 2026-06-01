// Dummy API for module initialization
// In the future, this will be replaced with actual API calls

export interface Scope {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface SubModule {
  id: string;
  name: string;
  code: string;
  displayOrder: number;
  scopes: Scope[];
  active: boolean;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  displayOrder: number;
  icon?: string;
  scopes: Scope[];
  subModules: SubModule[];
  active: boolean;
}

export interface InitApiResponse {
  modules: Module[];
  scopes: Scope[];
  userRole: string;
}

// Dummy API response - will be replaced with actual API call
export const getDummyModuleInit = (): InitApiResponse => {
  return {
    modules: [
      {
        id: "mod-1",
        name: "Dashboard",
        code: "DASHBOARD",
        displayOrder: 1,
        active: true,
        scopes: [
          { id: "scope-1", name: "View", code: "VIEW", description: "View dashboard" },
          { id: "scope-2", name: "Edit", code: "EDIT", description: "Edit dashboard" },
        ],
        subModules: [
          {
            id: "submod-1",
            name: "Analytics",
            code: "ANALYTICS",
            displayOrder: 1,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Export", code: "EXPORT" },
            ],
          },
          {
            id: "submod-2",
            name: "Reports",
            code: "REPORTS",
            displayOrder: 2,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Create", code: "CREATE" },
            ],
          },
        ],
      },
      {
        id: "mod-2",
        name: "User Management",
        code: "USER_MANAGEMENT",
        displayOrder: 2,
        active: true,
        scopes: [
          { id: "scope-1", name: "View", code: "VIEW" },
          { id: "scope-2", name: "Create", code: "CREATE" },
          { id: "scope-3", name: "Edit", code: "EDIT" },
          { id: "scope-4", name: "Delete", code: "DELETE" },
        ],
        subModules: [
          {
            id: "submod-3",
            name: "Users",
            code: "USERS",
            displayOrder: 1,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Create", code: "CREATE" },
            ],
          },
          {
            id: "submod-4",
            name: "Roles",
            code: "ROLES",
            displayOrder: 2,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Create", code: "CREATE" },
              { id: "scope-3", name: "Edit", code: "EDIT" },
            ],
          },
          {
            id: "submod-5",
            name: "Permissions",
            code: "PERMISSIONS",
            displayOrder: 3,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Manage", code: "MANAGE" },
            ],
          },
        ],
      },
      {
        id: "mod-3",
        name: "File Management",
        code: "FILE_MANAGEMENT",
        displayOrder: 3,
        active: true,
        scopes: [
          { id: "scope-1", name: "View", code: "VIEW" },
          { id: "scope-2", name: "Upload", code: "UPLOAD" },
          { id: "scope-3", name: "Delete", code: "DELETE" },
        ],
        subModules: [
          {
            id: "submod-6",
            name: "My Files",
            code: "MY_FILES",
            displayOrder: 1,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
              { id: "scope-2", name: "Upload", code: "UPLOAD" },
            ],
          },
          {
            id: "submod-7",
            name: "Shared",
            code: "SHARED",
            displayOrder: 2,
            active: true,
            scopes: [
              { id: "scope-1", name: "View", code: "VIEW" },
            ],
          },
        ],
      },
    ],
    scopes: [
      { id: "scope-1", name: "View", code: "VIEW" },
      { id: "scope-2", name: "Create", code: "CREATE" },
      { id: "scope-3", name: "Edit", code: "EDIT" },
      { id: "scope-4", name: "Delete", code: "DELETE" },
      { id: "scope-5", name: "Export", code: "EXPORT" },
      { id: "scope-6", name: "Manage", code: "MANAGE" },
      { id: "scope-7", name: "Upload", code: "UPLOAD" },
    ],
    userRole: "SUPER_ADMIN",
  };
};

// Replace this with actual API call in the future
export const initModules = async (): Promise<InitApiResponse> => {
  // TODO: Replace with actual API endpoint
  // return axiosInstance.get("/api/v1/init/modules");

  // For now, return dummy data with a slight delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getDummyModuleInit());
    }, 500);
  });
};
