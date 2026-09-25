import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../service/auth.api.js";
import {useSelector} from "react-redux";
import {Navigate} from "react-router";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await login(formData);
      setStatus({ type: "success", message: "Signed in successfully." });
      navigate("/");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to sign in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
if(!loading && user){
  return <Navigate to="/" replace />;
}
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.28),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#450a0a_55%,_#0f172a_100%)]" />
      <section className="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-950/75 p-8 shadow-2xl shadow-red-950/40 backdrop-blur-xl sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to continue
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Ask better questions. Find sharper answers.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:from-red-500 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {status.message && (
          <p
            className={`mt-5 text-center text-sm ${status.type === "error" ? "text-red-400" : "text-emerald-400"}`}
            role="status"
          >
            {status.message}
          </p>
        )}
        <p className="mt-8 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-red-400 hover:text-red-300"
            to="/register"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
