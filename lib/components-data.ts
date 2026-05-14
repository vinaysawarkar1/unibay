import raw from '@/data/components.json'
import type {
  Processor,
  GraphicsCard,
  Memory,
  Storage,
  Cooling,
  Case,
  PowerSupply,
} from '@/types'

export const processorCatalog = raw.processors as Processor[]
export const graphicsCatalog = raw.graphics as GraphicsCard[]
export const memoryCatalog = raw.memory as Memory[]
export const storageCatalog = raw.storage as Storage[]
export const coolingCatalog = raw.cooling as Cooling[]
export const caseCatalog = raw.cases as Case[]
export const powerSupplyCatalog = raw.powerSupply as PowerSupply[]
