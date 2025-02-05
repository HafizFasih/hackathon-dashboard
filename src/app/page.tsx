"use client"
import { client } from "@/lib/sanityClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async() => {
      const data = await client.fetch(`*[_type == "product"]`)
    })();
  }, []);
  return (
  <div className=""></div>
  );
}
