import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const [
      revenueAgg,
      yesterdayRevenueAgg,
      activeOrdersCount,
      pendingCount,
      recentOrders,
      dbStockAlerts,
    ] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.order.aggregate({
        where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: { status: { in: ['Pending', 'Processing'] } },
      }),
      this.prisma.order.count({ where: { status: 'Pending' } }),
      this.prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      this.prisma.stockAlert.findMany({ orderBy: { createdAt: 'asc' } }),
    ]);

    const totalRevenue = revenueAgg._sum.totalAmount ?? 0;
    const yesterdayRevenue = yesterdayRevenueAgg._sum.totalAmount ?? 0;
    const formattedRevenue = `₦${totalRevenue.toLocaleString()}`;

    const pctChange =
      yesterdayRevenue > 0
        ? Math.round(
            ((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100,
          )
        : totalRevenue > 0
          ? 100
          : 0;
    const trendLabel = `${pctChange >= 0 ? '+' : ''}${pctChange}% vs yesterday`;

    const recentActivity = recentOrders.slice(0, 5).map((order) => {
      const isCompleted = order.status === 'Completed';
      const isPending = order.status === 'Pending';

      return {
        icon: isCompleted
          ? 'receipt_long'
          : isPending
            ? 'pending_actions'
            : 'local_shipping',
        bg: isCompleted ? 'bg-primary-container/10' : 'bg-[#E3F2FD]',
        color: isCompleted ? 'text-primary-container' : 'text-[#1976D2]',
        title: `Order ${order.orderNumber} from ${order.customerName}`,
        sub: `${order.date} • Standard Order`,
        amount: order.total,
        badge: order.status,
        badgeBg: isCompleted ? 'bg-[#E8F5E9]' : 'bg-[#FFF8E1]',
        badgeText: isCompleted ? 'text-[#2E7D32]' : 'text-[#FBC02D]',
      };
    });

    const stockAlerts = dbStockAlerts.map((sa) => ({
      dot: sa.dot,
      title: sa.title,
      desc: sa.desc,
      action: sa.action || undefined,
    }));

    return {
      metrics: [
        {
          title: 'Total Revenue',
          icon: 'payments',
          iconColor: 'text-primary-container',
          value: formattedRevenue,
          trend: {
            icon: pctChange >= 0 ? 'trending_up' : 'trending_down',
            label: trendLabel,
            color: pctChange >= 0 ? 'text-[#2E7D32]' : 'text-error',
          },
          bgDeco: 'bg-primary-container/10',
        },
        {
          title: 'Active Orders',
          icon: 'local_shipping',
          iconColor: 'text-[#1976D2]',
          value: String(activeOrdersCount),
          sub: 'Active in pipeline',
          bgDeco: 'bg-[#E3F2FD]/50',
        },
        {
          title: 'Pending Inquiries',
          icon: 'mark_email_unread',
          iconColor: 'text-[#FBC02D]',
          value: String(pendingCount),
          alert:
            pendingCount > 0
              ? {
                  icon: 'warning',
                  label: `${pendingCount} require attention`,
                  color: 'text-error',
                }
              : undefined,
          bgDeco: 'bg-[#FFF8E1]/50',
        },
      ],
      recentActivity,
      stockAlerts,
    };
  }
}
