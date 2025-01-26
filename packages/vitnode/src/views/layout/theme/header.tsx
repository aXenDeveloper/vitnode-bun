import { ThemeSwitcher } from "@/components/switchers/theme-switcher";

export const HeaderLayout = () => {
  return (
    <header className="bg-background/75 top-0 z-20 w-full border-b backdrop-blur sm:sticky">
      <div className="container mx-auto p-4 flex items-center">
        <div>logo</div>

        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
