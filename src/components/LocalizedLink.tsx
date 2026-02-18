import { forwardRef } from "react";
import { Link, type LinkProps, type To } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface LocalizedLinkProps extends Omit<LinkProps, "to"> {
  to: To;
}

function getLocalizedTo(to: string, language: "en" | "it"): string {
  if (to === "/") {
    return `/${language}`;
  }

  if (!to.startsWith("/")) {
    return to;
  }

  if (
    to.startsWith("/en") ||
    to.startsWith("/it") ||
    to.startsWith("/admin") ||
    to.startsWith("/login")
  ) {
    return to;
  }

  const hashIndex = to.indexOf("#");
  const base = hashIndex >= 0 ? to.slice(0, hashIndex) : to;
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const localized = `/${language}${base}`;

  return `${localized}${hash}`;
}

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ to, ...props }, ref) => {
    const { language } = useLanguage();

    if (typeof to !== "string") {
      return <Link ref={ref} to={to} {...props} />;
    }

    const localizedTo = getLocalizedTo(to, language);

    return <Link ref={ref} to={localizedTo} {...props} />;
  },
);

LocalizedLink.displayName = "LocalizedLink";
