import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface CarCardProps {
  car: {
    id: number
    make: string
    model: string
    year: number
    color: string
    price: number
    mileage: number
    image_url: string
  }
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={car.image_url || "/placeholder.svg?height=400&width=600"}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-muted-foreground">{car.color}</p>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <p className="font-semibold text-lg">{formatCurrency(car.price)}</p>
          <p className="text-muted-foreground">{car.mileage.toLocaleString()} miles</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
