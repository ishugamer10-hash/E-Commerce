import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../src/assets/assets";
import { backendUrl, currency } from "../src/config";

const orderStatuses = ["order placed", "packing", "shipped", "out for delivery", "delivered"];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrders = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        setOrders((currentOrders) =>
          currentOrders.map((order) => (order._id === orderId ? { ...order, status } : order))
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage customer orders</h1>
          <p className="mt-2 text-sm text-slate-500">Track status, payment state, and delivery details from one place.</p>
        </div>
        <button
          type="button"
          onClick={fetchAllOrders}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-sm text-slate-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-sm text-slate-500">
            No orders have been placed yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[72px_2.2fr_1.3fr_1fr_1.1fr]"
            >
              <img className="h-14 w-14" src={assets.parcel_icon} alt="" />

              <div>
                <div className="space-y-1 text-sm text-slate-600">
                  {(order.item || []).map((item, index) => (
                    <p key={`${item._id || item.name}-${index}`}>
                      {item.name} x {item.quantity}
                      <span className="ml-1 text-slate-400">({item.size})</span>
                    </p>
                  ))}
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className="mt-1">{order.address?.street}</p>
                  <p>
                    {order.address?.city}, {order.address?.state}, {order.address?.country},{" "}
                    {order.address?.zipcode}
                  </p>
                  <p className="mt-1">{order.address?.phone}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Items:</span> {order.item?.length || 0}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Payment:</span>{" "}
                  {order.payment ? "Done" : "Pending"}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-sm font-semibold text-slate-900">
                {currency}
                {order.amount}
              </div>

              <select
                value={order.status}
                onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                className="h-fit rounded-xl px-3 py-2"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
