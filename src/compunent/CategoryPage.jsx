import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PulseLoader } from "react-spinners";

const CategoryPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [categoryName, setCategoryName] = useState("Category");

  // Fetch products and category name
  useEffect(() => {
    dispatch(fetchProducts());
    // Fetch category name (assuming category API supports fetching by ID)
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(
          `https://bzbackend.online/api/categories/categories/${id}`
        );
        setCategoryName(response.data.name || "Category");
      } catch (err) {
        console.error(
          "Fetch category error:",
          err.response?.data || err.message
        );
        setCategoryName("Category");
      }
    };
    fetchCategoryName();
  }, [dispatch, id]);

  // Filter products by category ID
  const filteredProducts = products.filter(
    (product) => product.category?._id === id || product.category === id
  );

  // Function to calculate discount percentage
  const calculateDiscountPercentage = (basePrice, discountedPrice) => {
    if (!basePrice || !discountedPrice || basePrice <= 0) return 0;
    return Math.round(((basePrice - discountedPrice) / basePrice) * 100);
  };

  return (
    <>
      
      
    </>
  );
};

export default CategoryPage;
