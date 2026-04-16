import { getCountries, getCountryCallingCode } from "libphonenumber-js";

function countryCodeToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return "";
  return iso2
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

const displayNames = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["en"], { type: "region" })
  : null;

export const PHONE_COUNTRIES = getCountries()
  .map((iso2) => {
    const dialCode = getCountryCallingCode(iso2);
    const name = displayNames?.of(iso2) || iso2;
    const isoLower = iso2.toLowerCase();
    return {
      iso2,
      name,
      dialCode,
      flag: countryCodeToFlag(iso2),
      flagUrl: `https://flagcdn.com/24x18/${isoLower}.png`,
      label: `${countryCodeToFlag(iso2)} ${name} (+${dialCode})`,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export function digitsOnly(value, maxLen) {
  const d = String(value || "").replace(/\D/g, "");
  return typeof maxLen === "number" ? d.slice(0, maxLen) : d;
}

export function formatLocalPhone11(raw) {
  const d = digitsOnly(raw, 11);
  if (!d) return "";
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
}

export function splitStoredPhone(storedDigits, fallbackIso2 = "PH") {
  const raw = digitsOnly(storedDigits);
  if (!raw) return { iso2: fallbackIso2, local: "" };

  // Longest dial-code match first.
  const sorted = [...PHONE_COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const match = sorted.find((c) => raw.startsWith(c.dialCode));

  if (!match) {
    return { iso2: fallbackIso2, local: raw.slice(0, 11) };
  }

  return {
    iso2: match.iso2,
    local: raw.slice(match.dialCode.length, match.dialCode.length + 11),
  };
}

export function composeStoredPhone(iso2, localDigits, fallbackIso2 = "PH") {
  const target = PHONE_COUNTRIES.find((c) => c.iso2 === iso2)
    || PHONE_COUNTRIES.find((c) => c.iso2 === fallbackIso2)
    || PHONE_COUNTRIES[0];
  const local = digitsOnly(localDigits, 11);
  return `${target?.dialCode || ""}${local}`;
}

