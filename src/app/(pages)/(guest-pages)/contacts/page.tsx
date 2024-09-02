import WithNavLayout from "@/components/layouts/withNavBar";
import React from "react";
import Blog from "./_page";
import WithTitleLayout from "@/components/layouts/withTitle";

const ContactsPage = () => {
  return (
    <WithNavLayout>
      <WithTitleLayout
        title="Contacts"
        description="We are social, we'd love to hear from you..."
      >
        <Blog />
      </WithTitleLayout>
    </WithNavLayout>
  );
};

export default ContactsPage;
