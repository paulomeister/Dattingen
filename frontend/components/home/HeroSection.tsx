"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { CirclePlay } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

// Memorizamos el componente para evitar renderizados innecesarios
export const HeroSection = memo(function HeroSection() {
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
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhIYFRcZHBwcJyIlJSUaHDMzKi4wGiIeJBwkKS//2wBDAQUFBQcGBw0HBw0kEhASJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wgARCAACAAMDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGKD//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//aAAwDAQACAAMAAAAQj//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Qf//Z"
        />
      </div>
    </div>
  );
});
