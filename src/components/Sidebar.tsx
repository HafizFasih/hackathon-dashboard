"use client"
import {
  Archive,
  Home,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
const list = [
  { name: "home", Icon: Home },
  { name: "products", Icon: Package },
  { name: "orders", Icon: ShoppingCart },
  { name: "customers", Icon: Users },
  { name: "archived", Icon: Archive },
  { name: "settings", Icon: Settings },
];

const Sidebar = () => {
    const [selected, setSelected] = useState<number>(0);
  return (
    <aside className="w-64 bg-white border-r shadow-md p-4 flex flex-col h-screen">
      <div className="flex items-center gap-3 mb-6">
        <LayoutGrid className="w-6 h-6 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {list.map(({ name, Icon }, ind) => (
          <Link
            key={ind}
            href={`/${name == "home" ? "" : name}`}
            onClick={()=>setSelected(ind)}
            className={`flex items-center gap-3 p-3 text-gray-900 font-medium rounded-lg  capitalize ${selected == ind ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Icon className="w-5 h-5" /> {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
