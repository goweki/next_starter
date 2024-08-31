"use client";
import React, { useState, useEffect } from "react";

/**
 * A custom hook to implement different date/time variations.
 */
export function useDate() {
  const locale = "en";
  const [today, setDate] = useState(new Date()); // Save the current date in state to be able to trigger an update

  useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);

  function rawDate(): Date {
    return today;
  }

  function date(): string {
    const day = today.toLocaleDateString(locale, { weekday: "long" });
    const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(
      locale,
      {
        month: "long",
      }
    )}`;
    return date;
  }

  function time(): string {
    const time = today.toLocaleTimeString(locale, {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
    return time;
  }

  function wish(): string {
    const hour = today.getHours();
    const wish = `Good ${
      (hour < 12 && "morning") || (hour < 17 && "afternoon") || "evening"
    }, `;
    return wish;
  }

  return {
    rawDate,
    date,
    time,
    wish,
  };
}
