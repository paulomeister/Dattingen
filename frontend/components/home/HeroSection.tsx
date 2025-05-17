"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { CirclePlay } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export const HeroSection = memo(function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  function handleStartButton(): void {
    router.push(isLoggedIn ? "/audits" : "/auth");
  }

  return (
    <div className="space-y-20 px-4">
      {/* Intro Section */}
      <div className="text-center mt-10 flex items-center justify-center flex-col">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          {t("home.hero.title")}
          <br />
          <strong>{t("home.hero.titleBold")}</strong>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {t("home.hero.description")}
          <br />
          <strong>{t("home.hero.descriptionBold")}</strong>
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
          blurDataURL="data:image/jpeg;base64,..."
        />
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("home.benefits.title")}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">{t("home.benefits.description")}</p>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">{t("home.benefits.cards.fast.title")}</h3>
            <p className="text-gray-600">{t("home.benefits.cards.fast.description")}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">{t("home.benefits.cards.dashboard.title")}</h3>
            <p className="text-gray-600">{t("home.benefits.cards.dashboard.description")}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">{t("home.benefits.cards.standards.title")}</h3>
            <p className="text-gray-600">{t("home.benefits.cards.standards.description")}</p>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
        <div className="relative">
          <Image
            src="/auditing.jpg"
            alt="Auditing Process"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,..."
          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">{t("home.gallery.image1")}</p>
        </div>

        <div className="relative">
          <Image
            src="/dashboard.jpg"
            alt="Compliance Dashboard"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,..."
          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">{t("home.gallery.image2")}</p>
        </div>

        <div className="relative">
          <Image
            src="/certified.jpg"
            alt="Certification Badge"
            width={400}
            height={300}
            priority
            placeholder="blur"
            className="rounded-xl shadow-md object-cover w-full h-[250px]"
            blurDataURL="data:image/jpeg;base64,..."
          />
          <p className="mt-4 text-primary-color font-semibold text-center text-lg">{t("home.gallery.image3")}</p>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-primary-color/10 rounded-xl py-12 px-6 text-center shadow-lg max-w-3xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("home.cta.title")}</h2>
          <p className="text-gray-600 mb-6">{t("home.cta.description")}</p>
          <Button
            variant="outline"
            onClick={handleStartButton}
            className="gap-2 text-xl rounded-2xl shadow-lg bg-primary-color text-white hover:text-white transition hover:scale-110 hover:bg-secondary-color"
          >
            <CirclePlay />
            {t("home.cta.button")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
});
