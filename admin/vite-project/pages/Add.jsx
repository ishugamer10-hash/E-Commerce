import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../src/assets/assets";
import { backendUrl } from "../src/config";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  category: "Men",
  subCategory: "Topwear",
  bestseller: false,
};

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [sizes, setSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSize = (size) => {
    setSizes((currentSizes) =>
      currentSizes.includes(size) ? currentSizes.filter((item) => item !== size) : [...currentSizes, size]
    );
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setFormState(initialFormState);
    setSizes([]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!sizes.length) {
      toast.error("Select at least one size");
      return;
    }

    if (!image1) {
      toast.error("Upload at least one product image");
      return;
    }

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("description", formState.description);
    payload.append("price", formState.price);
    payload.append("category", formState.category);
    payload.append("subCategory", formState.subCategory);
    payload.append("bestseller", String(formState.bestseller));
    payload.append("sizes", JSON.stringify(sizes));

    if (image1) payload.append("image1", image1);
    if (image2) payload.append("image2", image2);
    if (image3) payload.append("image3", image3);
    if (image4) payload.append("image4", image4);

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/product/add`, payload, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImagePicker = (id, image, setImage) => (
    <label
      htmlFor={id}
      className="flex h-28 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-900"
    >
      <img
        className="h-full w-full object-cover"
        src={image ? URL.createObjectURL(image) : assets.upload_area}
        alt="Upload preview"
      />
      <input
        id={id}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => setImage(event.target.files?.[0] || null)}
      />
    </label>
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Add a new product</h1>
        <p className="mt-2 text-sm text-slate-500">Upload images, fill in product details, and publish a new item.</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-700">Product images</p>
          <div className="flex flex-wrap gap-4">
            {renderImagePicker("image1", image1, setImage1)}
            {renderImagePicker("image2", image2, setImage2)}
            {renderImagePicker("image3", image3, setImage3)}
            {renderImagePicker("image4", image4, setImage4)}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                Product name
              </label>
              <input
                id="name"
                type="text"
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl px-4 py-3"
                placeholder="Type here"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">
                Product description
              </label>
              <textarea
                id="description"
                rows="6"
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-xl px-4 py-3"
                placeholder="Write a short product description"
                required
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="category">
                  Product category
                </label>
                <select
                  id="category"
                  value={formState.category}
                  onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-xl px-4 py-3"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="subCategory">
                  Sub category
                </label>
                <select
                  id="subCategory"
                  value={formState.subCategory}
                  onChange={(event) => setFormState((current) => ({ ...current, subCategory: event.target.value }))}
                  className="w-full rounded-xl px-4 py-3"
                >
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="price">
                Product price
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formState.price}
                onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                className="w-full rounded-xl px-4 py-3"
                placeholder="25"
                required
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Available sizes</p>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      sizes.includes(size)
                        ? "bg-slate-900 text-white"
                        : "border border-slate-300 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={formState.bestseller}
                onChange={() =>
                  setFormState((current) => ({ ...current, bestseller: !current.bestseller }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Add to bestseller collection</span>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
