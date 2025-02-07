import { client } from "@/lib/sanityClient";

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  dimensions: Dimensions;
  category: "cutlery" | "crockory" | "tables" | "ceramics" | "plant-pots" | "chairs" | "tableware";
  price: number;
  tags: string[];
}

const sortProductId = (data: { _id: string }[]) => {
  const sorted = data.sort((a: any, b: any) => {
    return (
      parseInt(a._id.split("-")[1], 10) - parseInt(b._id.split("-")[1], 10)
    );
  });
  return sorted;
};

const getProductId = async() => {
  const data = await client.fetch('*[_type == "product"]{_id}');
  let count: number = 1;
  let vacantProductId = "";
  for (let product of sortProductId(data)) {
    if (`product-${count}` !== product._id) {
      vacantProductId = `product-${count}`;
      break;
    }
    ++count;
  }
  console.log(vacantProductId);
  return vacantProductId ? vacantProductId : `product-${data.length + 1}`;
}

async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    console.log(`Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const bufferImage = Buffer.from(buffer);

    const asset: {
      _id: string;
    } = await client.assets.upload("image", bufferImage, {
      filename: imageUrl.split("/").pop(),
    });

    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error("Failed to upload image:", imageUrl, error);
    return null;
  }
}

export async function addProduct(product: Product): Promise<void> {
  try {
    const imageId = await uploadImageToSanity(product.image);
    if (imageId) {
      const document = {
        _type: "product",
        name: product.name,
        _id: await getProductId(),
        description: product.description,
        price: product.price,
        quantity: 1,
        image: {
          _type: "image",
          asset: {
            _ref: imageId,
          },
        },
        slug: {
          _type: "slug",
          current: product.name.replace(" ", "-").toLowerCase(),
        },
        category: product.category,
        dimensions: product.dimensions,
        tags: product.tags,
        features: product.features,
      };

      const createdProduct = await client.create(document);
      console.log(
        `Product ${product.name} uploaded successfully:`,
        createdProduct
      );
    } else {
      console.log(
        `Product ${product.name} skipped due to image upload failure.`
      );
    }
  } catch (error) {
    console.error("Error uploading product:", error);
  }
}
