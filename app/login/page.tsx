"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      alert("Missing credentials.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8">Admin Portal Login</h2>
      <Card className="max-w-100">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials below to access the admin portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
