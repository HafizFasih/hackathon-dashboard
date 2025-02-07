"use client";
import uploadImageToCloudinary from "@/helpers/uploadImage";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  name: string;
  description: string;
  image: string;
  features: string[] | string;
  width: number;
  height: number;
  depth: number;
  category:
    | "cutlery"
    | "crockory"
    | "tables"
    | "ceramics"
    | "plant-pots"
    | "chairs"
    | "tableware";
  price: number;
  tags: string[];
}

const defaultProduct: Product = {
  name: "",
  description: "",
  image: "/default.png",
  features: [],
  width: 0,
  height: 0,
  depth: 0,
  category: "cutlery",
  price: 0,
  tags: [],
};

const ProductForm = ({
  setIsAddProduct,
  operation,
  setRefresh,
  _id,
}: {
  setIsAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  operation: string;
  _id: string;
}) => {
  const [product, setProduct] = useState<Product>(defaultProduct);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (operation === "edit") {
      (async () => {
        try {
          let { data } = (await axios.get(`/api/products?_id=${_id}`)).data;
          data = data[0];
          const recievedProduct = {
            name: data.name,
            description: data.description,
            image: data.image,
            features: data.features ? data.features.join(",") : data.features,
            tags: data.tags ? data.tags.join(",") : data.tags,
            category: data.category,
            price: data.price,
            width: Number(data.dimensions.width.replaceAll("cm", "")),
            height: Number(data.dimensions.height.replaceAll("cm", "")),
            depth: Number(data.dimensions.depth.replaceAll("cm", "")),
          };
          setProduct(recievedProduct);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageInString: string = (await uploadImageToCloudinary(
        file
      )) as string;
      setProduct({ ...product, image: imageInString });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: product.name,
      description: product.description,
      image: product.image,
      features: product.features,
      category: product.category,
      price: Number(product.price),
      tags: product.tags,
      dimensions: {
        width: `${product.width}cm`,
        height: `${product.height}cm`,
        depth: `${product.depth}cm`,
      },
    };
    try {
      await axios.post("/api/products/", data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsAddProduct(false);
      setRefresh(val => !val);
    }
    setProduct(defaultProduct);
  };

  const editProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: product.name,
        description: product.description,
        image: product.image,
        features: (product.features as string).split(","),
        category: product.category,
        price: Number(product.price),
        tags: product.tags,
        dimensions: {
          width: `${product.width}cm`,
          height: `${product.height}cm`,
          depth: `${product.depth}cm`,
        },
      };
      await axios.put("/api/products", {
        _id,
        payload: data,
        image: product.image,
      });
      setProduct(defaultProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsAddProduct(false);
      setRefresh(val => !val);
    }
  };
  return (
    <div className="bg-white w-full rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {operation == "edit" ? "Edit Product" : "Add Product"}
      </h2>
      <form
        onSubmit={(e) => (operation === "add" ? addProduct(e) : editProduct(e))}
        className="grid grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Description"
            required
          />
          <input
            type="text"
            name="features"
            value={product.features}
            onChange={(e) =>
              setProduct({
                ...product,
                features: e.target.value.split(","),
              })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Features (comma-separated)"
            required
          />
          <div className="flex space-x-4">
            <input
              type="number"
              name="width"
              value={product.width ? product.width : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Width"
              required
            />
            <input
              type="number"
              name="height"
              value={product.height ? product.height : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Height"
              required
            />
            <input
              type="number"
              name="depth"
              value={product.depth ? product.depth : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Depth"
              required
            />
          </div>
          <select
            name="category"
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value as "cutlery" })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="cutlery">Cutlery</option>
            <option value="crockory">Crockory</option>
            <option value="tables">Tables</option>
            <option value="ceramics">Ceramics</option>
            <option value="plant-pots">Plant Pots</option>
            <option value="chairs">Chairs</option>
            <option value="tableware">Tableware</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            name="price"
            value={product.price ? product.price : ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Price"
            required
          />
          <input
            type="text"
            name="tags"
            value={product.tags}
            onChange={(e) =>
              setProduct({
                ...product,
                tags: e.target.value.split(","),
              })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Tags (comma-separated)"
            required
          />
          <div>
            <span className="relative h-36 w-full flex bg-[#EAEEF2] rounded-md border border-gray-300 mb-3">
              <Image
                src={product.image}
                alt="Preview"
                fill={true}
                objectFit="contain"
              />
            </span>
            <input
              onChange={handleFileChange}
              type="file"
              name="image"
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div className="col-span-2 flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 ${
              loading && "cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
          <span
            onClick={() => setIsAddProduct(false)}
            className="bg-gray-500 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </span>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
