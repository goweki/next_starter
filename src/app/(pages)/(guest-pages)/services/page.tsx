import WithNavLayout from "@/components/layouts/withNavBar";
import React from "react";
import Services from "./_page";
import WithTitleLayout from "@/components/layouts/withTitle";

const ServicesPage = () => {
  return (
    <WithNavLayout>
      <WithTitleLayout
        title="Services"
        description="Customized packages to meet your needs"
      >
        <Services />
      </WithTitleLayout>
    </WithNavLayout>
  );
};

export default ServicesPage;
