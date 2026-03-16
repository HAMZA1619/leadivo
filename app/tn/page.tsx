import type { Metadata } from "next"
import { COUNTRIES } from "@/lib/countries"
import { generateCountryMetadata, CountryPage } from "@/lib/country-page"

const country = COUNTRIES.tn

export const metadata: Metadata = generateCountryMetadata(country)

export default function TunisiaPage() {
  return <CountryPage country={country} />
}
