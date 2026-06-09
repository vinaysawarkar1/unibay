import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { Package, ShoppingCart, Users, BookOpen } from 'lucide-react'

async function getStats() {
  const [productCount, orderCount, userCount, blogCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.blogPost.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
  })

  return {
    productCount,
    orderCount,
    userCount,
    blogCount,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
  }: {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    trend?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.productCount}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={stats.orderCount}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value={stats.userCount}
          icon={Users}
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogCount}
          icon={BookOpen}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            £{(stats.totalRevenue / 100).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Total revenue from all orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{(order.total / 100).toFixed(2)}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
