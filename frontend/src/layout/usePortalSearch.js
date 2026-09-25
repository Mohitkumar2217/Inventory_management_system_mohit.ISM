import { useOutletContext } from "react-router-dom";

export default function usePortalSearch() {
  return useOutletContext()?.searchQuery || "";
}