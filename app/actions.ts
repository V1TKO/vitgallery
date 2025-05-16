"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Sample car data for seeding the database
const sampleCars = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Silver",
    price: 25999.99,
    mileage: 15000,
    description: "A reliable and fuel-efficient sedan with modern features.",
    image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2021,
    color: "Blue",
    price: 22500.0,
    mileage: 18000,
    description: "Compact sedan with excellent fuel economy and sporty handling.",
    image_url: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format&fit=crop",
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2020,
    color: "Red",
    price: 35750.0,
    mileage: 12000,
    description: "Iconic American muscle car with powerful engine options.",
    image_url: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop",
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    color: "White",
    price: 42999.99,
    mileage: 5000,
    description: "All-electric sedan with cutting-edge technology and impressive range.",
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2021,
    color: "Black",
    price: 41500.0,
    mileage: 22000,
    description: "Luxury sedan with dynamic performance and premium features.",
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
  },
  {
    make: "Chevrolet",
    model: "Corvette",
    year: 2022,
    color: "Yellow",
    price: 65000.0,
    mileage: 8000,
    description: "High-performance sports car with head-turning design.",
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
  },
  {
    make: "Audi",
    model: "A4",
    year: 2020,
    color: "Gray",
    price: 38750.0,
    mileage: 25000,
    description: "Refined luxury sedan with advanced technology and elegant styling.",
    image_url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format&fit=crop",
  },
  {
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2021,
    color: "Silver",
    price: 55000.0,
    mileage: 18000,
    description: "Sophisticated luxury sedan with exceptional comfort and technology.",
    image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop",
  },
  {
    make: "Lexus",
    model: "RX",
    year: 2022,
    color: "White",
    price: 48500.0,
    mileage: 12000,
    description: "Luxury SUV with a smooth ride and upscale interior.",
    image_url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop",
  },
  {
    make: "Porsche",
    model: "911",
    year: 2020,
    color: "Red",
    price: 98000.0,
    mileage: 15000,
    description: "Iconic sports car with exhilarating performance and timeless design.",
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
  },
  {
    make: "Subaru",
    model: "Outback",
    year: 2021,
    color: "Green",
    price: 32500.0,
    mileage: 20000,
    description: "Versatile wagon with all-wheel drive and rugged capability.",
    image_url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
  },
  {
    make: "Volkswagen",
    model: "Golf",
    year: 2020,
    color: "Blue",
    price: 24500.0,
    mileage: 28000,
    description: "Practical hatchback with refined driving dynamics and quality interior.",
    image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
  },
]

// Function to seed the database with sample car data
export async function seedCars() {
  try {
    // Check if we already have cars in the database
    const existingCars = await sql`SELECT COUNT(*) as count FROM cars`

    if (existingCars[0].count > 0) {
      return { success: true, message: "Database already has cars. Skipping seed operation." }
    }

    // Insert sample cars
    for (const car of sampleCars) {
      await sql`
        INSERT INTO cars (make, model, year, color, price, mileage, description, image_url) 
        VALUES (
          ${car.make}, 
          ${car.model}, 
          ${car.year}, 
          ${car.color}, 
          ${car.price}, 
          ${car.mileage}, 
          ${car.description}, 
          ${car.image_url}
        )
      `
    }

    // Revalidate the cars page to reflect the new data
    revalidatePath("/")

    return { success: true, message: "Database seeded successfully with sample car data." }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Failed to seed database." }
  }
}

// Function to add a new car to the database
export async function addCar(formData: FormData) {
  try {
    const make = formData.get("make") as string
    const model = formData.get("model") as string
    const year = Number.parseInt(formData.get("year") as string)
    const color = formData.get("color") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const mileage = Number.parseInt(formData.get("mileage") as string)
    const description = formData.get("description") as string
    const image_url = formData.get("image_url") as string

    // Validate required fields
    if (!make || !model || !year || isNaN(year)) {
      return { success: false, message: "Make, model, and year are required fields." }
    }

    // Insert the new car
    await sql`
      INSERT INTO cars (make, model, year, color, price, mileage, description, image_url) 
      VALUES (
        ${make}, 
        ${model}, 
        ${year}, 
        ${color}, 
        ${price}, 
        ${mileage}, 
        ${description}, 
        ${image_url}
      )
    `

    // Revalidate the cars page to reflect the new data
    revalidatePath("/")

    return { success: true, message: "Car added successfully." }
  } catch (error) {
    console.error("Error adding car:", error)
    return { success: false, message: "Failed to add car." }
  }
}
