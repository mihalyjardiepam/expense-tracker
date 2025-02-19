import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { NavLink, useNavigate } from "react-router";
import FormField from "~/components/form-field/FormField";
import RequiredFieldExplanation from "~/components/RequiredFieldExplanation";
import { UserContext } from "~/context/user-context";
import { useFetch } from "~/hooks/use-fetch";

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const user = useContext(UserContext);

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
        console.log("Successful log in!");
      }
    });
  }, []);

  const [formError, setFormError] = useState("");
  const [authFetch] = useFetch("auth");
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
