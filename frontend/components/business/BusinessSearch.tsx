"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export default function BusinessSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current search parameter from URL
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Function to update URL with search parameter
  const updateSearchParams = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      router.push(`/business?${params.toString()}`);
    },
    [router, searchParams]
  );
  
  // Apply debounce to search text changes
  useDebounce(
    () => {
      updateSearchParams(searchQuery);
    },
    [searchQuery, updateSearchParams],
    300 // 300ms debounce timing as requested
  );
  
  return (
    <div className="relative mb-8 transform transition-all duration-300 ease-in-out">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("business.page.search")}
          className="pl-10 pr-10 py-6 text-base w-full border-input focus:ring-2 focus:ring-primary-color/50 transition-all duration-300"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            className="absolute right-2 text-primary-color hover:text-primary-color/80"
            onClick={() => {
              setSearchQuery("");
              updateSearchParams("");
            }}
          >
            {t("business.page.clear")}
          </Button>
        )}
      </div>
    </div>
  );
}