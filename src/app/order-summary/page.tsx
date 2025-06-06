"use client"

import { OrderSummary } from '../pages/OrderSummary'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'

export default function OrderSummaryPage() {
  return (
    <ProtectedRoute>
      <OrderSummary />
    </ProtectedRoute>
  )
}
