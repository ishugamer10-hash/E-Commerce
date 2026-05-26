import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../src/config";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Product list</h1>
          <p className="mt-2 text-sm text-slate-500">Review everything currently available in the storefront.</p>
        </div>
        <button
          type="button"
          onClick={fetchList}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="hidden grid-cols-[96px_2fr_1fr_1fr_112px] bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600 md:grid">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {isLoading ? (
          <div className="px-4 py-10 text-sm text-slate-500">Loading products...</div>
        ) : list.length === 0 ? (
          <div className="px-4 py-10 text-sm text-slate-500">No products found yet.</div>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="grid gap-4 border-t border-slate-200 px-4 py-4 md:grid-cols-[96px_2fr_1fr_1fr_112px] md:items-center"
            >
              <img
                className="h-20 w-20 rounded-2xl object-cover"
                src={item.image?.[0]}
                alt={item.name}
              />
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.subCategory}</p>
              </div>
              <p className="text-sm text-slate-600">{item.category}</p>
              <p className="text-sm font-medium text-slate-900">
                {currency}
                {item.price}
              </p>
              <button
                type="button"
                onClick={() => removeProduct(item._id)}
                className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-500 hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
