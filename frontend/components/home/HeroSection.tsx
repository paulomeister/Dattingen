"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { CirclePlay } from "lucide-react";
import Image from "next/image";

export function HeroSection() {

  const {t} = useLanguage();

  return (
    <div className="space-x-2">
      <div className="text-center mb-16 flex items-center justify-center flex-col ">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Show the World What
          <br />
          <strong>You Mean</strong>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Certify your enterprise with the best practices and standards in the
          world. <br />
          <strong>Be the best version of your enterprise.</strong>
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="gap-2 text-xl rounded-2xl shadow-lg bg-primary-color text-white hover:text-white ease-in transition-all hover:scale-110 hover:ease-in hover:duration-200 hover:bg-secondary-color hover:cursor-pointer"
          >
            <CirclePlay />
            Start!
          </Button>
        </div>
      </div>

      <div className="relative">
        <Image
          src="/hero.jpg"
          alt="Background Gradient"
          width={1080}
          height={720}
          priority
        />
      </div>
    </div>
  );
}
