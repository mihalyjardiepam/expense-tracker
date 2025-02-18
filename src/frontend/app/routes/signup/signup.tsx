import React, {
  useCallback,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { NavLink, useNavigate } from "react-router";
import FormField from "~/components/form-field/FormField";
import RequiredFieldExplanation from "~/components/RequiredFieldExplanation";
import { useFetch } from "~/hooks/use-fetch";
import { Currency, CurrencyNames, CurrencySymbols } from "~/models/currency";

const Signup = () => {
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState("initial");
  const [authFetch] = useFetch("auth");
  const navigate = useNavigate();

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setFormError("");
      const formData = new FormData(e.target as HTMLFormElement);

      let email = (formData.get("email")?.valueOf() as string) ?? "";
      let name = (formData.get("name")?.valueOf() as string) ?? "";
      let password = (formData.get("password")?.valueOf() as string) ?? "";
      let passwordConfirm =
        (formData.get("confirm-password")?.valueOf() as string) ?? "";
      const defaultCurrency =
        (formData.get("default-currency")?.valueOf() as string) ?? "";

      email = email.trim();
      name = name.trim();

      if (!email || !password || !passwordConfirm || !defaultCurrency) {
        setFormError("Please enter all required values.");
        return;
      }

      try {
        const response = await authFetch("/signup", {
          body: JSON.stringify({
            name,
            email,
            password,
            defaultCurrency,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (response.ok) {
          setFormStatus("success");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setFormError(`Failed to send request: ${error.message}`);
        }
      }
    });
  }, []);

  return (
    <main>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <NavLink to="/login">Back to Login</NavLink>
        <FormField
          label="Email address"
          hint="email@example.com"
          error="Error: XYZ"
        >
          <input type="text" name="email" required />
        </FormField>

        <FormField label="Name" hint="John Doe">
          <input type="text" name="name" />
        </FormField>

        <FormField label="Password" hint="minimum 6 characters">
          <input required type="password" name="password" />
        </FormField>

        <FormField label="Confirm Password" hint="must match password">
          <input required type="password" name="confirm-password" />
        </FormField>

        <FormField label="Default Currency">
          <select name="default-currency" defaultValue="" required>
            <option disabled value="">
              -- Select a Currency
            </option>
            {Object.entries(Currency).map(([key, value]) => (
              <option key={key} value={value}>
                {CurrencyNames[value]} ({CurrencySymbols[value]})
              </option>
            ))}
          </select>
        </FormField>
        <RequiredFieldExplanation />
        {formError && <span className="form-error">{formError}</span>}
        {formStatus != "success" && (
          <div className="button-area">
            <button className="app-btn color-primary" disabled={isPending}>
              Sign up
            </button>
          </div>
        )}
        {formStatus == "success" && (
          <p>Successful sign up. Redirecting to Login.</p>
        )}
      </form>
    </main>
  );
};

export default React.memo(Signup);
