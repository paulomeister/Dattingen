// Server Component to display Ruleset details
import { environment } from "@/env/environment.dev";
import { Ruleset } from "@/types/Ruleset";
import { 
  RulesetDetails, 
  ErrorMessage 
} from "@/components/normatives/RulesetDetails";
import { LoadingState } from "@/components/normatives/RulesetLoading";
import { Suspense } from "react";

// Function to get ruleset data from API with better error handling
async function getRuleset(id: string): Promise<{ ruleset?: Ruleset; error?: string }> {
  try {
    // Using server-side fetch for data fetching
    const response = await fetch(`${environment.API_URL}/rulesets/api/findbyid/${id}`, {
      cache: 'no-store', // Ensuring we always get fresh data
      next: { tags: [`ruleset-${id}`] } // Add cache tag for revalidation
    });

    if (!response.ok) {
      return { 
        error: `Failed to fetch ruleset: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { ruleset: data };
  } catch (error) {
    console.error("Error fetching ruleset:", error);
    return { 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

// RulesetPage component
async function RulesetPage({ params }: { params: { id: string } }) {
  // Fetch ruleset data using the ID from URL params
  const { ruleset, error } = await getRuleset(params.id);
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (!ruleset) {
    return <ErrorMessage message="No ruleset data available" />;
  }

  // Convert publishingDate to proper Date object if it's a string
  if (typeof ruleset.publishingDate === 'string') {
    ruleset.publishingDate = new Date(ruleset.publishingDate);
  }

  return <RulesetDetails ruleset={ruleset} />;
}

// Main page component with Suspense for loading state
export default function RulesetDetailsPage(props: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <RulesetPage params={props.params} />
    </Suspense>
  );
}
