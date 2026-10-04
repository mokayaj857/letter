import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUserStore } from "@/lib/userStore";
import { WEEKLY_GAME_ID } from "@/data/weeklyChallenges";

export const Route = createFileRoute("/challenge/")({
  head: () => ({
    meta: [{ title: "Daily challenge — Letterbox" }],
  }),
  component: ChallengeRedirect,
});

function ChallengeRedirect() {
  const navigate = useNavigate();
  const { auth, gameProgress } = useUserStore();
  const done = gameProgress[WEEKLY_GAME_ID] ?? 0;
  const week = Math.min(104, Math.max(1, done + 1));

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate({ to: "/signup", replace: true });
      return;
    }
    navigate({ to: "/challenge/$week", params: { week: String(week) }, replace: true });
  }, [auth?.isLoggedIn, navigate, week]);

  return null;
}
