import { client } from "@/lib/sanityClient";

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  features: string[];
  dimensions: Dimensions;
  category: Category;
  price: number;
  tags: string[];
}

interface Params {
  _id: string;
  image: string;
  payload: Product;
}

const uploadImageFromUrl = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const asset = await client.assets.upload("image", blob, {
      contentType: blob.type,
      filename: "uploaded-image.jpg",
    });
    return asset._id;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

const editProduct = async ({ _id, payload, image }: Params) => {
  try {
    let imageRef : any = image;
    if (image.startsWith("http")) {
      const assetId = await uploadImageFromUrl(image);
      imageRef = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: assetId,
        },
      };
    }
    const updatedData = await client
      .patch(_id)
      .set({
        ...payload,
        image: imageRef, 
      })
      .commit();

    return updatedData;
  } catch (error) {
    console.log(error);
    throw new Error("Product update failed");
  }
};
export default editProduct;