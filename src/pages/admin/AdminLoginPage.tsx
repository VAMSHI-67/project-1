import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Button } from "../../components/shared/Button";

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-lg glass-card rounded-3xl p-8">
        <h1 className="font-display text-3xl text-forest-900">Admin Login</h1>
        <p className="mt-2 text-sm text-forest-600">Sign in to manage bookings and availability.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-forest-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-medium text-forest-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};
