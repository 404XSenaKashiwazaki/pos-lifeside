"use server"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createOrderNumber = async () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 25
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // 10
  const day = now.getDate().toString().padStart(2, '0') // 12

  const prefix = `${process.env.APP_NAME?.split(" ").join("-").replaceAll(".","")}-${year}${month}${day}`

  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const lastTransaction = await prisma.order.findFirst({
    where: {
      createdAt: {
        gte: firstOfMonth,
        lte: lastOfMonth
      }
    },
    orderBy: {
      id: 'desc'
    }
  })

  let sequence = 1
  if (lastTransaction) {
    const lastCode = lastTransaction.orderNumber
    const lastSeq = parseInt(lastCode.split('-')[3], 10)
    sequence = lastSeq + 1
  }

  const newCode = `${prefix}-${sequence.toString().padStart(3, '0')}`
  
  return newCode
}