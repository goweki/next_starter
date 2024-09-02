import WithNavLayout from "@/components/layouts/withNavBar";
import React from "react";
import Blog from "./_page";
import WithTitleLayout from "@/components/layouts/withTitle";

export default function BlogPage() {
  return (
    <WithNavLayout>
      <WithTitleLayout
        title="Blog"
        description="Where we share thoughts, sentiments and knowledge"
      >
        <Blog />
      </WithTitleLayout>
    </WithNavLayout>
  );
}
