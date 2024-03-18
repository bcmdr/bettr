"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Header() {
  const [name, setName] = useState<string>("");
  const [loadingName, setLoadingName] = useState(true);
  useEffect(() => {
    const localName =
      typeof window !== undefined && window?.localStorage?.getItem("username")
        ? localStorage?.getItem("username")
        : "";
    setName(localName ? localName : "");
    setLoadingName(false);
  }, []);
  return (
    <header className="bg-cyan-950 font-bold shadow text-white p-2 px-3 sticky top-0 z-10 flex items-center justify-between m-0">
      <Link className="text-sm" href="/">
        QuibList
      </Link>
      <div
        onClick={() => {
          let nameToSet = prompt("Name");
          if (!nameToSet) return;
          setName(nameToSet);
          window.localStorage.setItem("username", nameToSet);
        }}
        className="font-normal text-xs"
      >
        {loadingName ? `` : name ? name : `Sign In`}
      </div>
    </header>
  );
}
