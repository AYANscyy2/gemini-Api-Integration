"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { v4 } from "uuid";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { RiGoogleLine } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password
      });
      const chatId = v4();

      if (signInResult?.error) {
        console.error("Error signing in", signInResult.error);
        router.push("/");
        toast.error("error signing in");
        setError(`${signInResult.error}`);
      } else {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    const chatId = v4();
    try {
      await signIn("google", {
        callbackUrl: `/chat/${chatId}`
      });
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google");
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-white font-bold">
          Welcome back
        </CardTitle>
        <CardDescription>Log in to your account to continue</CardDescription>
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-white bg-white/10 border-white/10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs text-gray-400"
                >
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 text-white border-white/10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-2 bg-white/[0.7] text-black hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-px flex-1 bg-gray-800"></div>
          <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-800"></div>
        </div>
        <div className="w-full">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full bg-white/[0.7] border-white/10 hover:text-white hover:bg-white/10"
            disabled={isLoading}
          >
            <RiGoogleLine className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="p-0 h-auto text-gray-300">
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
