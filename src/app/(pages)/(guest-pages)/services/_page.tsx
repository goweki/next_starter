"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => (
  <Card
    className={cn(
      `w-72 flex flex-col justify-between py-1 ${
        popular ? "border-emerald-400" : "border-slate-500"
      } mx-auto sm:mx-0`,
      {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      }
    )}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
              {title}
            </CardTitle>
            <div
              className={cn(
                "px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white",
                {
                  "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ":
                    popular,
                }
              )}
            >
              Save Ksh.{(monthlyPrice * 12 - yearlyPrice).toLocaleString()}
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
            {title}
          </CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">
            {yearlyPrice && isYearly
              ? "Ksh." + yearlyPrice.toLocaleString()
              : monthlyPrice
              ? "Ksh." + monthlyPrice.toLocaleString()
              : "Custom"}
          </h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            {yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null}
          </span>
        </div>
        <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function Services() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1);

  const plans = [
    {
      title: "BASIC",
      monthlyPrice: 10000,
      yearlyPrice: 100000,
      description: "Essential features to manage your contacts",
      features: ["contacts manager", "bulk sms", "support"],
      actionLabel: "Get Started",
    },
    {
      title: "STANDARD",
      monthlyPrice: 20000,
      yearlyPrice: 200000,
      description:
        "Perfect for owners with 100+ contacts and medium sized establishments",
      features: [
        "contacts manager",
        "bulk sms",
        "support",
        "Email and Reports",
      ],
      actionLabel: "Get Started",
      popular: true,
    },
    {
      title: "GOLD",
      price: "Custom",
      description: "Dedicated support and infrastructure to fit your needs",
      features: [
        "contacts manager",
        "bulk sms",
        "live support",
        "Email and Reports",
        "Dashboard and Payments",
      ],
      actionLabel: "Contact Sales",
      exclusive: true,
    },
  ];
  return (
    <div>
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => {
          return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />;
        })}
      </section>
    </div>
  );
}
