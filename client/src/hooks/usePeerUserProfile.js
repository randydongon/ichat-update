import { useState } from "react";

export default function usePeerUserProfile() {
  const [peeruser, setPeerUser] = useState(() => {
    const user = localStorage.getItem("peeruser");
    if (user == null) return;

    return JSON.parse(user);
  });

  return [peeruser, setPeerUser];
}
