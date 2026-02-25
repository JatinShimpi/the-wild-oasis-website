import SideNavigation from "@/app/_components/SideNavigation";

export default function layout({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] md:h-full gap-4 md:gap-12 items-start">
      <SideNavigation />
      <div className="py-4 px-2 md:py-1 md:px-0">{children}</div>
    </div>
  );
}
