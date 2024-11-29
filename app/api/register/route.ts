import { NextResponse } from "next/server";

// apagar
export async function POST(request: Request) {
  try {
    const { email, password, name, mode } = await request.json();
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
