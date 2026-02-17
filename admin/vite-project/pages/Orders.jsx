import { current } from '@reduxjs/toolkit'
import React, { useState } from 'react'

const Orders = () => {
  
  const[orders,setOrders]=useState([])
  const fetchAllOrders=async()=>{
    if (!token) {
      return null
    }
    try {
      const response=await axios.post(backendUrl+'/api/order/list',{},{headers:{token}})
      if (response.data.success) {
        setOrders(response.data.orders)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  return (
    <div>
      <h3>Order page</h3>
      <div>
        {
          orders.map((orders,index)=>{
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 item-start border-2 border-gray-200 p-5 md:8 my-3 md:my-4 text-xs  sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>

            
              <div>
                {orders.item.map((item,index)=>{
                  if (index===orders.item.length-1) {
                    return <p className='py-0.5' key={index}>{item.name}x{item.quantity} <span>{item.size}</span> </p>
                  }else{
                      return <p className='py-0.5' key={index}>{item.name}x{item.quantity} <span>{item.size}</span> ,</p>
                  }

                })}
              </div>
              <p className='mt-3 mb-2 font-medium' >{order.address.firstName+""+order.address.lastName }</p>
              <div><p>{order.address.street+","}</p>
              <p>{order.address.city+"," +order.address.state+","+order.address.country+"," +order.address.zipcode+","}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]' >Items:{orders.item.length} </p>
              <p className='mt-3'>Method:{orders.paymentMethod} </p>
              <p>Payment:{order.payment ?'done':'pending'} </p>
              <p>Date:{new Date(order.Date).tolocalStorage()} </p>
            </div>
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount} </p>
            <select value={order.status} className='p-2 font-semibold'>
              <option value="order placed">order placed</option>
                   <option value="packing">packing</option>
                        <option value="shipped">shipped</option>
                             <option value="out for delivery">out for delivery</option>
                                  <option value="delivered">delivered</option>
            </select>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default Orders
