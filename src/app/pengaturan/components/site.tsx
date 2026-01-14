"use client";

import React from "react";
import FormSite from "./formSite";
import { useSite } from "@/components/providers/Site-provider";

const SiteSection = () => {
  const site = useSite();
  return (
    <FormSite
      name={site?.name ?? ""}
      address={site?.address ?? ""}
      email={site?.email ?? ""}
      phone={site?.phone ?? ""}
      filename={site?.filename ?? ""}
      fileUrl={site?.fileProofUrl ?? ""}
    />
  );
};

export default SiteSection;
