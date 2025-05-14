/*
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
          Certify your business with the best practices and standards in the
          world. <br />
          <strong>Be the best version of your business.</strong>
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
*/

"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { CirclePlay } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { motion } from "framer-motion";


export const HeroSection = memo(function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 px-4">

      {/* Intro Section */}
      <div className="text-center mt-10 flex items-center justify-center flex-col">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Show the World What
          <br />
          <strong>You Mean</strong>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Certify your business with the best practices and standards in the world.
          <br />
          <strong>Be the best version of your business.</strong>
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative max-w-5xl mx-auto">
        <Image
          src="/hero.jpg"
          alt="Business Certification"
          width={1080}
          height={820}
          priority
          placeholder="blur"
          className="rounded-xl shadow-md object-cover w-full h-[250px]"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhIYFRcZHBwcJyIlJSUaHDMzKi4wGiIeJBwkKS//2wBDAQUFBQcGBw0HBw0kEhASJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wgARCAACAAMDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGKD//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//aAAwDAQACAAMAAAAQj//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Qf//Z"
        />
      </div>



      {/* Benefits Section */}
      <div className="bg-gray-50 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Why Get Certified with ACME?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Our platform helps you streamline audits, reduce costs, and ensure compliance
          with international standards like ISO 27001, ISO 9001, and NIST SP 800-53.
        </p>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Faster Audits</h3>
            <p className="text-gray-600">
              Simplify your certification process and cut down on manual work with guided workflows.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Real-Time Dashboards</h3>
            <p className="text-gray-600">
              Get full visibility into your organization’s compliance progress with dynamic metrics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Global Standards</h3>
            <p className="text-gray-600">
              Align with key norms like ISO 45001 and NIST using our multilingual and flexible tools.
            </p>
          </div>
        </div>
      </div>
      
      {/* Image Grid Section - estilo hero */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
        {/* Imagen 1 */}
        <div className="relative">
          <Image
            src="/auditing.jpg"
            alt="Auditing Process"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHB..."
          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">Structured Auditing Process</p>
        </div>

        {/* Imagen 2 */}
        <div className="relative">
          <Image
            src="/dashboard.jpg"
            alt="Compliance Dashboard"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHB..."

          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">Real-time Compliance Dashboard</p>
        </div>

        {/* Imagen 3 */}
        <div className="relative">
          <Image
            src="/certified.jpg"
            alt="Certification Badge"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL..."

          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">Professional Certification Showcase</p>
        </div>
      </div>


      {/* Actuar */}
      <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="bg-primary-color/10 rounded-xl py-12 px-6 text-center shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Ready to raise your standards?
      </h2>
      <p className="text-gray-600 mb-6">
        Start your certification journey today and show the world your commitment to excellence.
      </p>
    <Button
      variant="outline"
      className="gap-2 text-xl rounded-2xl shadow-lg bg-primary-color text-white hover:text-white ease-in transition-all hover:scale-110 hover:ease-in hover:duration-200 hover:bg-secondary-color hover:cursor-pointer"
    >
      <CirclePlay />
      Start!
    </Button>
  </div>
</motion.div>


    </div>
  );
});
