import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen } from "@/components/PhoneFrame";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Letterbox" },
      {
        name: "description",
        content:
          "Log back into Letterbox and keep your money adventure and coin streak going.",
      },
      { property: "og:title", content: "Log in — Letterbox" },
      {
        property: "og:description",
        content: "Welcome back to Letterbox, the kids money adventure app.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <Screen withNav={false}>
      <div className="flex flex-col items-center text-center">
        <img
          src={mascot}
          alt="Boxy the Letterbox mascot"
          width={768}
          height={768}
          className="size-40 animate-bob object-contain"
        />
        <h1 className="mt-2 text-4xl font-bold text-primary-deep">Letterbox</h1>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Welcome back, little saver!
        </p>
      </div>

      <form className="mt-8 space-y-4">
        <Field label="Your name or email" placeholder="amani@family.com" />
        <Field label="Secret code" placeholder="••••••" type="password" />

        <button
          type="button"
          className="w-full rounded-3xl bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-pop active:translate-y-1.5 active:shadow-none"
        >
          Let&apos;s play
        </button>
      </form>

      <button className="mt-3 w-full text-center text-sm font-bold text-muted-foreground">
        Forgot your secret code?
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-0.5 flex-1 rounded bg-border" />
        <span className="text-xs font-bold text-muted-foreground">or</span>
        <span className="h-0.5 flex-1 rounded bg-border" />
      </div>

      <button className="w-full rounded-3xl border-2 border-border bg-card py-3.5 font-display font-bold text-foreground shadow-card">
        🎨 Log in with a picture code
      </button>

      <p className="mt-8 text-center text-sm font-semibold text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-bold text-primary-deep underline">
          Make an account
        </Link>
      </p>
    </Screen>
  );
}

export function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="ml-2 font-display text-sm font-bold text-primary-deep">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 text-base font-semibold outline-none placeholder:text-muted-foreground focus:border-primary"
      />
    </label>
  );
}
