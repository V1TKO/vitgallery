import { getCarById } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

interface CarDetailPageProps {
  params: {
    id: string
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const carId = Number.parseInt(params.id)

  if (isNaN(carId)) {
    notFound()
  }

  const car = await getCarById(carId)

  if (!car) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link href="/" className="inline-flex items-center mb-6">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-lg">
          <Image
            src={car.image_url || "/placeholder.svg?height=600&width=800"}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-xl text-muted-foreground">{car.color}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/40 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">{formatCurrency(car.price)}</p>
            </div>
            <div className="bg-muted/40 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Mileage</p>
              <p className="text-2xl font-bold">{car.mileage.toLocaleString()} miles</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{car.description}</p>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <ul className="space-y-2">
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Make</span>
                <span>{car.make}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Model</span>
                <span>{car.model}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Year</span>
                <span>{car.year}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Color</span>
                <span>{car.color}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
