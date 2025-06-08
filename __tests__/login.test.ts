import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'

jest.mock('bcryptjs', () => ({ compare: jest.fn() }))
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'token') }))

const mockUser = {
  id: '1', email: 'test@test.com', name: 'Test', role: 'CUSTOMER', hashedPassword: 'hash'
}

const createRequest = (body: any) => new NextRequest('http://test.com/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' }
})

describe('Auth Login API', () => {
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  const bcrypt = require('bcryptjs')

  beforeEach(() => jest.clearAllMocks())

  test('successful login', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)

    const response = await POST(createRequest({ email: 'test@test.com', password: 'pass' }))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.token).toBe('token')
  })

  test('missing credentials', async () => {
    const response = await POST(createRequest({ email: 'test@test.com' }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email and password are required')
  })

  test('invalid user', async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    const response = await POST(createRequest({ email: 'bad@test.com', password: 'pass' }))
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })

  test('wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(false)

    const response = await POST(createRequest({ email: 'test@test.com', password: 'wrong' }))
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })
})
