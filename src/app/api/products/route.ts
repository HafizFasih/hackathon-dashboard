import { addProduct } from "@/helpers/addProduct";
import editProduct from "@/helpers/editProduct";
import urlFor from "@/helpers/imageConverter";
import { client } from "@/lib/sanityClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const _id = request.nextUrl.searchParams.get("_id");
    let data = [];
    if (_id) {
      let response: any = await client.getDocument(_id);
      response.image = urlFor(response.image);
      response && data.push(response);
    } else {
      data = await client.fetch(`*[_type == "product"]{
      category, name, slug, "image": image.asset->url, _createdAt, price,
      quantity, tags, description, features, dimensions, _id}`);
    }
    return NextResponse.json(
      { result: "Data fetched", success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    await addProduct(product);
    return NextResponse.json(
      { result: "Product added successfully.", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const response = await request.json();
    const data = await editProduct(response);
    return NextResponse.json(
      { result: "Data has been updated", success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const _id = request.nextUrl.searchParams.get("_id")!;
    const data = await client.delete(_id);
    console.log(data);
    return NextResponse.json(
      { result: "Data has been updated", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { result: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
