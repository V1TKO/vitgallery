import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to get all cars with optional filtering
export async function getCars({
  make,
  model,
  yearMin,
  yearMax,
  limit = 50,
  offset = 0,
}: {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  limit?: number
  offset?: number
} = {}) {
  // Start building the query parts
  const conditions = []
  const params = []

  if (make) {
    conditions.push(`make ILIKE '%${make}%'`)
  }

  if (model) {
    conditions.push(`model ILIKE '%${model}%'`)
  }

  if (yearMin) {
    conditions.push(`year >= ${yearMin}`)
  }

  if (yearMax) {
    conditions.push(`year <= ${yearMax}`)
  }

  // Construct the WHERE clause
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  // Execute the query using tagged template literals
  const result = await sql`
    SELECT * FROM cars 
    ${sql.unsafe(whereClause)} 
    ORDER BY year DESC 
    LIMIT ${limit} OFFSET ${offset}
  `

  return result
}

// Get a single car by ID
export async function getCarById(id: number) {
  const result = await sql`SELECT * FROM cars WHERE id = ${id}`
  return result[0] || null
}

// Get unique makes for filtering
export async function getUniqueMakes() {
  const result = await sql`SELECT DISTINCT make FROM cars ORDER BY make`
  return result.map((row) => row.make)
}

// Get unique models for a specific make
export async function getUniqueModels(make?: string) {
  if (make) {
    const result = await sql`SELECT DISTINCT model FROM cars WHERE make ILIKE ${"%" + make + "%"} ORDER BY model`
    return result.map((row) => row.model)
  } else {
    const result = await sql`SELECT DISTINCT model FROM cars ORDER BY model`
    return result.map((row) => row.model)
  }
}

// Get min and max years for the year range filter
export async function getYearRange() {
  const result = await sql`SELECT MIN(year) as min_year, MAX(year) as max_year FROM cars`
  return {
    minYear: result[0]?.min_year || 2000,
    maxYear: result[0]?.max_year || 2023,
  }
}
