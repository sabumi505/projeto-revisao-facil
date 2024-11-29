import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const { id } = await segmentData.params;
  if (!id) {
    return NextResponse.json({ error: "teacher id is required" }, { status: 400 });
  }
  const foundTeacher = await prismaClient.teacher.findUnique({
    where: { id },
  });
  return NextResponse.json(foundTeacher, { status: 200 });
}


