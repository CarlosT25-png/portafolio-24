import React from "react";
import { createClient } from "@/prismicio";
import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";
import NavBar from "./NavBar";

const Header = async () => {
  const client = createClient()
  const settings = await client.getSingle("settings")

  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}

export default Header;