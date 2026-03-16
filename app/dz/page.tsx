import type { Metadata } from "next"
import { COUNTRIES } from "@/lib/countries"
import { generateCountryMetadata, CountryPage } from "@/lib/country-page"

const country = COUNTRIES.dz

export const metadata: Metadata = generateCountryMetadata(country)

export default function AlgeriaPage() {
  return <CountryPage country={country} />
}
