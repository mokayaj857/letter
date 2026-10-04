import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/challenge")({
  component: ChallengeLayout,
});

function ChallengeLayout() {
  return <Outlet />;
}
