import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b p-6">
      <p className="text-4xl font-bold">RK Market Place</p>
      <div className="flex mt-4">
        <Link href="/">
          <a className="mr-4 text-pink-500 font-semibold">Home</a>
        </Link>
        <Link href="/create">
          <a className="mr-4 text-pink-500 font-semibold">Create a Capsule</a>
        </Link>
        <Link href="/owned">
          <a className="mr-4 text-pink-500 font-semibold">My Capsules</a>
        </Link>
        <Link href="/dashboard">
          <a className="mr-4 text-pink-500 font-semibold"> Dashboard</a>
        </Link>
      </div>
    </nav>
  );
};
