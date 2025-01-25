import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("core");

  return (
    <div>
      <h1>{t("test")}</h1>
    </div>
  );
}
