"use client"
import { Helmet } from 'react-helmet-async'
import { MonthRevenueCard } from '../../components/MonthRevenueCard'
import { MonthOrdersAmountCard } from '../../components/Month-Orders-Amount-Card'
import { DayOrdersAmountCard } from '../../components/Day-Orders-Amount-Card'
import { MonthCanceledOrdersAmountCard } from '../../components/Month-Canceled-Orders-Amount-Card'
import { RevenueChart } from '../../components/Revenue-Chart'
import { PopularProductsChart } from '../../components/Popular-Products-Chart'
export default function dashboard() {
    return(
        <>
      <div className='pt-6'>
      <Helmet title="Dashboard" />
       <div className="flex flex-col gap-4">
        <h1 className="text-3xl  p-4 font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenueCard />
          <MonthOrdersAmountCard />
          <DayOrdersAmountCard />
          <MonthCanceledOrdersAmountCard />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <RevenueChart />
          <PopularProductsChart />
        </div>
      </div>
      </div>
        </>
    )
}