"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isMounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);
  if (!isMounted) return null;

  //handle ThemeToggle
  const handleToggle = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <Button size="icon" variant="outline" onClick={handleToggle}>
      {resolvedTheme === "dark" ? (
        <>
          <Sun className="h-5 w-5" />
          <span className="sr-only">light theme</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 hover:text-" />
          <span className="sr-only">dark theme</span>
        </>
      )}
    </Button>
  );
}
