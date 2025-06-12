import { useContext } from "react";
import { ProfileContext } from "../Context/ProfileContext";

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}
