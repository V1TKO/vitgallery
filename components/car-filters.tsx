"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CarFiltersProps {
  makes: string[]
  models: string[]
  yearRange: {
    minYear: number
    maxYear: number
  }
}

export function CarFilters({ makes, models, yearRange }: CarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedMake, setSelectedMake] = useState<string>(searchParams.get("make") || "")
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get("model") || "")
  const [yearMin, setYearMin] = useState<number>(
    Number.parseInt(searchParams.get("yearMin") || yearRange.minYear.toString()),
  )
  const [yearMax, setYearMax] = useState<number>(
    Number.parseInt(searchParams.get("yearMax") || yearRange.maxYear.toString()),
  )

  // Update the URL with the selected filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedMake) params.set("make", selectedMake)
    if (selectedModel) params.set("model", selectedModel)
    if (yearMin !== yearRange.minYear) params.set("yearMin", yearMin.toString())
    if (yearMax !== yearRange.maxYear) params.set("yearMax", yearMax.toString())

    router.push(`/?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedMake("")
    setSelectedModel("")
    setYearMin(yearRange.minYear)
    setYearMax(yearRange.maxYear)
    router.push("/")
  }

  return (
    <div className="space-y-6 p-4 bg-muted/40 rounded-lg">
      <h2 className="text-xl font-semibold">Filter Cars</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Select value={selectedMake} onValueChange={setSelectedMake}>
            <SelectTrigger id="make">
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Year Range</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min={yearRange.minYear}
              max={yearMax}
              value={yearMin}
              onChange={(e) => setYearMin(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span>to</span>
            <Input
              type="number"
              min={yearMin}
              max={yearRange.maxYear}
              value={yearMax}
              onChange={(e) => setYearMax(Number.parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={resetFilters} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
