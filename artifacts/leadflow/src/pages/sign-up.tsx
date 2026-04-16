import { useState } from "react";
import { Link, useLocation } from "wouter";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign up failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border">
        <div className="text-center">
          <img src={`${basePath}/logo.png`} alt="ALKABRAIN" className="w-12 h-12 rounded-xl mx-auto mb-3" />
          <h2 className="text-2xl font-black">Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">ALKABRAIN</span> account</h2>
          <p className="text-muted-foreground text-sm mt-1">Start growing your business today</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleEmail} className="space-y-4">
          <div><Label>Full Name</Label><Input value={name} onChange={e=>setName(e.target.value)} className="mt-1" placeholder="Rahul Sharma" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1" placeholder="you@email.com" /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1" placeholder="Min 6 characters" minLength={6} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Free Account"}</Button>
        </form>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">or</span></div></div>
        <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>
        <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="text-primary font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
