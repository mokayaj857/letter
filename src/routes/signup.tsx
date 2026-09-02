import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen } from "@/components/PhoneFrame";
import { Field } from "./login";
import { avatarList } from "@/assets/icons";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Letterbox — Kids Money Adventure" },
      {
        name: "description",
        content:
          "Create a Letterbox account, pick your character and start the money adventure for ages 10+.",
      },
      { property: "og:title", content: "Join Letterbox — Kids Money Adventure" },
      {
        property: "og:description",
        content: "Sign up in seconds and start earning XP and coins with Boxy.",
      },
    ],
  }),
  component: Signup,
});

const avatars = avatarList.slice(0, 6);
const ages = ["10", "11", "12", "13+"];

function Signup() {
  return (
    <Screen withNav={false}>
      <Link
        to="/login"
        className="font-display text-sm font-bold text-muted-foreground"
      >
        ← Back
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-primary-deep">
        Let&apos;s make your box!
      </h1>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Set up your player card in under a minute.
      </p>

      <section className="mt-6">
        <p className="ml-2 font-display text-sm font-bold text-primary-deep">
          Choose your character
        </p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {avatars.map(([key, src], i) => (
            <button
              key={key}
              type="button"
              aria-label={key}
              className={`press grid aspect-square animate-pop-in place-items-center rounded-2xl border-2 p-1.5 shadow-card hover:-translate-y-0.5 active:scale-95 ${
                i === 0 ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <img
                src={src}
                alt=""
                aria-hidden
                width={384}
                height={384}
                className="size-full object-contain"
              />
            </button>
          ))}
        </div>
      </section>

      <form className="mt-5 space-y-4">
        <Field label="Kid's first name" placeholder="Amani" />

        <div>
          <p className="ml-2 font-display text-sm font-bold text-primary-deep">
            How old are you?
          </p>
          <div className="mt-1 flex gap-2">
            {ages.map((age, i) => (
              <button
                key={age}
                type="button"
                className={`flex-1 rounded-3xl border-2 py-3 font-display text-lg font-bold shadow-card ${
                  i === 1
                    ? "border-primary bg-primary-soft text-primary-deep"
                    : "border-border bg-card"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <Field label="Grown-up's email" placeholder="parent@family.com" />
        <Field label="Secret code" placeholder="••••••" type="password" />

        <button
          type="button"
          className="w-full rounded-3xl bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-pop active:translate-y-1.5 active:shadow-none"
        >
          Start the adventure
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
        Already have a box?{" "}
        <Link to="/login" className="font-bold text-primary-deep underline">
          Log in
        </Link>
      </p>
    </Screen>
  );
}
