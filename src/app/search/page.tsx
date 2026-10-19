import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { SearchResults } from "@/components/shop/SearchResults";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default function SearchPage() {
  return (
    <>
      <PageHeader crumb="Search" eyebrow="Find your drape" title="Search" italic="the collection." />
      {/* the query lives in the URL, so results render on the client */}
      <Suspense fallback={<div className="container-x h-64 py-12" aria-busy="true" />}>
        <SearchResults />
      </Suspense>
    </>
  );
}
