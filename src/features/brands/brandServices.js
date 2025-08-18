import axios from "axios";

const API_URL = "https://api.cloudandroots.com/api/brands/";

const getBrands = async () => {
  console.log("Fetching brands from:", API_URL);
  try {
    const response = await axios.get(API_URL);
    console.log("getBrands response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getBrands error:", error.response?.data || error.message);
    throw error;
  }
};

const brandService = {
  getBrands,
};

export default brandService;
