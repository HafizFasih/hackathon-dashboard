"use client";
import { Search, Plus, FileText } from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/helpers/basic";
import { useEffect, useState } from "react";
import ProductForm from "./AddProduct";
import { MdOutlineModeEditOutline } from "react-icons/md";
import axios from "axios";

export default function Dashboard() {
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit" | "">("");
  const [showOperations, setShowOperations] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [productId, setProductId] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = (await axios.get("/api/products")).data;
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [refresh]);

  const deleteProduct = async (_id: string) => {
    try {
      await axios.delete(`/api/products?_id=${_id}`);
      setRefresh((val) => !val);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="flex-1 p-6 h-screen overflow-y-scroll">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full border rounded-md shadow-sm"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export
            </Button>
            <Button
              onClick={() => {
                setOperation("add");
                setIsAddProduct(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-5 h-5" /> Add Product
            </Button>
          </div>
        </div>

        {!isAddProduct ? (
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex gap-4 border-b pb-2 mb-4">
              <Button variant="outline">All</Button>
              <Button variant="ghost">Active</Button>
              <Button variant="ghost">Draft</Button>
              <Button variant="ghost">Archived</Button>
            </div>
            <div className="space-y-4">
              {products.map((product: any, ind: number) => (
                <Card
                  key={ind}
                  className="flex items-center p-4 gap-4 border rounded-lg shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <CardContent className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-gray-500">{product.price}</p>
                  </CardContent>
                  <p className="text-gray-700 font-medium">
                    {product.sales} Sales
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(product._createdAt)}
                  </p>
                  <button
                    onClick={() => {
                      setShowOperations((val) => !val);
                      setIndex(ind);
                    }}
                    className="ml-auto text-gray-500 hover:text-gray-700 font-bold relative"
                  >
                    ⋮
                    {showOperations && index == ind && (
                      <ul className="absolute bg-white right-0 bottom-full rounded-md border flex flex-col">
                        <li
                          onClick={() => {
                            setIsAddProduct(true);
                            setOperation("edit");
                            setProductId(product._id);
                          }}
                          className="h-1/2 w-28 p-1 capitalize flex items-center font-normal gap-1 hover:bg-gray-200"
                        >
                          <MdOutlineModeEditOutline className="text-black" />
                          <h3>edit</h3>
                        </li>
                        <li
                          onClick={() => deleteProduct(product._id)}
                          className="h-1/2 w-28 p-1 capitalize flex items-center font-normal gap-1 hover:bg-gray-200"
                        >
                          <RiDeleteBin6Line className="text-red-500" />
                          <h3>delete</h3>
                        </li>
                      </ul>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <ProductForm
            setIsAddProduct={setIsAddProduct}
            operation={operation}
            setRefresh={setRefresh}
            _id={productId}
          />
        )}
      </div>
    </div>
  );
}
