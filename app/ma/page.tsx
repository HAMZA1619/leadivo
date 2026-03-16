import type { Metadata } from "next"
import { COUNTRIES } from "@/lib/countries"
import { generateCountryMetadata, CountryPage } from "@/lib/country-page"

const country = COUNTRIES.ma

export const metadata: Metadata = generateCountryMetadata(country)

export default function MoroccoPage() {
  return <CountryPage country={country} />
}
