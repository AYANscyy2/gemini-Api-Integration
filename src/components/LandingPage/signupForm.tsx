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
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from "lucide-react";
import { RiGoogleLine } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { createUser } from "@/app/action";
import { useRouter } from "next/navigation";

const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");
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
      // Validate inputs (optional)
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      // Call the createUser server action
      const result = await createUser({
        email,
        password,
        name: name || email.split("@")[0] // Use part of email as name if not provided
      });

      if (!result.success) {
        setError(result.error || "Failed to create account");
        toast.error(result.error || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password
      });
      const chatId = v4();

      if (signInResult?.error) {
        console.error("Error signing in after signup:", signInResult.error);
        router.push("/");
      } else {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setError("Failed to create account");
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    const chatId = v4();
    try {
      await signIn("google", {
        callbackUrl: `/chat/${chatId}`
      });
      toast.success("Successfully signed up!");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      setError("Failed to sign up with Google");
      toast.error("Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-white font-bold">
          Create an account
        </CardTitle>
        <CardDescription>Sign up to get started</CardDescription>
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
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 text-white bg-white/10 border-white/10"
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
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
              {isLoading ? "Creating account..." : "Sign up"}
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
            onClick={handleGoogleSignUp}
            className="w-full bg-white/[0.7] border-white/10 hover:text-white hover:bg-white/10"
            disabled={isLoading}
          >
            <RiGoogleLine className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto text-gray-300">
            Log in
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
