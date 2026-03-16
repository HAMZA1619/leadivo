import type { Metadata } from "next"
import { COUNTRIES } from "@/lib/countries"
import { generateCountryMetadata, CountryPage } from "@/lib/country-page"

const country = COUNTRIES.fr

export const metadata: Metadata = generateCountryMetadata(country)

export default function FrenchPage() {
  return <CountryPage country={country} />
}
