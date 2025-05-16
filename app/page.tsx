import { getCars, getUniqueMakes, getUniqueModels, getYearRange } from "@/lib/db"
import { CarCard } from "@/components/car-card"
import { CarFilters } from "@/components/car-filters"
import { Button } from "@/components/ui/button"
import { seedCars } from "./actions"
import Link from "next/link"

interface HomePageProps {
  searchParams: {
    make?: string
    model?: string
    yearMin?: string
    yearMax?: string
    page?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // Parse search params
  const make = searchParams.make
  const model = searchParams.model
  const yearMin = searchParams.yearMin ? Number.parseInt(searchParams.yearMin) : undefined
  const yearMax = searchParams.yearMax ? Number.parseInt(searchParams.yearMax) : undefined
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = 12
  const offset = (page - 1) * limit

  // Fetch cars with filters
  const cars = await getCars({
    make,
    model,
    yearMin,
    yearMax,
    limit,
    offset,
  })

  // Fetch filter options
  const makes = await getUniqueMakes()
  const models = await getUniqueModels(make)
  const yearRange = await getYearRange()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Car Gallery</h1>
        <div className="flex space-x-4">
          <form action={seedCars}>
            <Button type="submit" variant="outline">
              Seed Database
            </Button>
          </form>
          <Link href="/add-car">
            <Button>Add New Car</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CarFilters makes={makes} models={models} yearRange={yearRange} />
        </div>

        <div className="md:col-span-3">
          {cars.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No cars found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or add some cars to the database.</p>
              <form action={seedCars}>
                <Button type="submit">Seed Database with Sample Cars</Button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
