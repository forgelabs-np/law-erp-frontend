export interface TokenDetails {
  access_token: string;
  refresh_token: string;
}

export enum Authorities {
  "gateway" = "gateway",
  "removeGatewaySidebar" = "removeGatewaySidebar",
  "vendor" = "cbs-vendor",
  "client" = "client",
  "hidden" = "hidden",
}

export interface MofinTokenDetails {
  contactNo: string;
  email: string;
  id: null | number;
  name: string;
  profilePic: string;
  role: string;
  roleId: null | number;
  schemeBased: boolean;
  username: string;
  workspace: Authorities;
  exp: number;
  workspacedataid: number;
}

function setToken(token: TokenDetails) {
  try {
    // localStorage.setItem("auth", JSON.stringify(token));
    localStorage.setItem("token", token.access_token);
    localStorage.setItem("refresh_token", token.refresh_token);
  } catch (e) {
    // console.error("Error storing token", e);
  }
}

function getToken() {
  try {
    // return JSON.parse(localStorage.getItem("auth") || "") as TokenDetails;
    return {
      access_token: localStorage.getItem("token") ?? "",
      refresh_token: localStorage.getItem("refresh_token") ?? "",
    } as TokenDetails;
  } catch (e) {
    return null;
  }
}

function getTokenDetails(): MofinTokenDetails | null {
  try {
    const token = getToken();
    return token
      ? (JSON.parse(
        window.atob(token.access_token.split(".")[1])
      ) as MofinTokenDetails)
      : null;
  } catch (e) {
    return null;
  }
}

function isAuthenticated() {
  const tokenDetails = getTokenDetails();
  console.log(tokenDetails, "tokennnDetaile")
  if (tokenDetails) {
    return tokenDetails.exp * 1000 > Date.now();
  } else {
    return false;
  }
}

function checkRBAC(authorities: Authorities[]) {
  const tokenDetails = getTokenDetails();
  if (tokenDetails) {
    return authorities.find((auth) => auth === tokenDetails.workspace);
  } else {
    return false;
  }
}

function clearToken() {
  // localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}

export const getRole = () => {
  return getTokenDetails()?.workspacedataid;
};

const TokenService = {
  setToken,
  getToken,
  getTokenDetails,
  isAuthenticated,
  checkRBAC,
  clearToken,
};

export default TokenService;
