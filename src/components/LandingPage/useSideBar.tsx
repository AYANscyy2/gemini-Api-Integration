"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Providers } from "@/app/providers";

export const UseSideBar = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" ? (
        <div className="hidden md:flex md:max-w-[20%]  2xl:max-w-[30%] ">
          <Providers>
            <Sidebar />
          </Providers>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
