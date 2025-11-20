import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setSearchTerm,
} from "../features/products/productSlice";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toSlug } from "../utils/slugify";

const SearchPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const { products, loading, error } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    dispatch(setSearchTerm(query)); // optional if you store search in redux
    dispatch(fetchProducts());
  }, [dispatch, query]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await axios.get(
          "https://bzbackend.online/api/categories/categories"
        );
        setCategories(response.data);
      } catch (err) {
        setCategoriesError(
          err.response?.data?.message || "Failed to fetch categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.product_name?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="font-daraz bg-white">


      <div className="md:w-[95%] mx-auto px-2 md:px-0 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-500 mb-8">
          Search Results for <span className="text-[#f06621]">"{query}"</span>
        </h2>

        {/* Categories */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
            Matching Categories
          </h3>
          {categoriesLoading ? (
            <Skeleton count={4} height={30} />
          ) : categoriesError ? (
            <p className="text-red-500">{categoriesError}</p>
          ) : filteredCategories.length === 0 ? (
            <p>No categories found for "{query}"</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${toSlug(cat.name)}`}
                  className="px-4 py-2 border rounded hover:bg-orange-50"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Products */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
            Matching Products
          </h3>
          {loading ? (
            <Skeleton count={4} height={150} />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found for "{query}"</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${toSlug(p.product_name)}`}
                  className="border rounded p-2 hover:shadow-lg"
                >
                  <img
                    src={
                      p.product_images?.[0] || "https://via.placeholder.com/150"
                    }
                    alt={p.product_name}
                    className="w-full h-40 object-contain"
                  />
                  <h3 className="text-sm mt-2">{p.product_name}</h3>
                  <p className="text-sm font-semibold">
                    Rs. {p.product_discounted_price || p.product_base_price}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
