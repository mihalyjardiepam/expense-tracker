import React, {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { NavLink, useNavigate } from "react-router";
import FormField from "~/components/form-field/FormField";
import RequiredFieldExplanation from "~/components/RequiredFieldExplanation";
import { useAppSelector } from "~/hooks/redux";
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from "~/hooks/use-authentication";
import { useServiceDiscovery } from "~/hooks/use-service-discovery";

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.target as HTMLFormElement);

    const email = (formData.get("email")?.valueOf() as string) ?? "";
    const password = (formData.get("password")?.valueOf() as string) ?? "";

    if (!email || !password) {
      return setFormError("Please fill all required fields.");
    }

    startTransition(async () => {
      const response = await authFetch("/login", {
        body: JSON.stringify({
          email,
          password,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const token: string = await response.json();

        localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, token);
      }
    });
  }, []);

  const [formError, setFormError] = useState("");
  const authFetch = useServiceDiscovery("auth");
  const navigate = useNavigate();

  return (
    <main>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Login</h1>
        <FormField label="Email address" hint="email@example.com">
          <input type="text" disabled={isPending} required name="email" />
        </FormField>
        <FormField label="Password">
          <input type="text" disabled={isPending} required name="password" />
        </FormField>
        <RequiredFieldExplanation />
        {formError && <span className="form-error">{formError}</span>}
        <div className="button-area">
          <button disabled={isPending} className="app-btn color-primary">
            Login
          </button>
        </div>
      </form>
    </main>
  );
};

export default React.memo(Login);
