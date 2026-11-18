export function setDataToken(token, role, user) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("rol", role);
  if (user) {
    setUserData(user);
  }
}


export function setUserData(user) {
  sessionStorage.setItem("userName", user.name || "");
  sessionStorage.setItem("userPhoto", user.photo || "");
}

export function getUserData() {
  return {
    name: sessionStorage.getItem("userName") || "",
    photo: sessionStorage.getItem("userPhoto") || "",
  };
}

export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("rol");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userPhoto");
}

export function isLoggedIn() {
  return !!sessionStorage.getItem("token");
}

export function isAdmin() {
  const role = sessionStorage.getItem("rol");
  return role && role.toUpperCase() === "ADMIN";
}