import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const { id } = await segmentData.params;
  if (!id) {
    return NextResponse.json({ error: "essay is required" }, { status: 400 });
  }
  const foundEssay = await prismaClient.essay.findUnique({
    where: { id },
  });
  return NextResponse.json(foundEssay, { status: 200 });
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  const { id } = await segmentData.params;
  if (!id) {
    return NextResponse.json({ error: "essay is required" }, { status: 400 });
  }
  const essayData = await request.json();
  const essayD = { ...essayData };
  delete essayD['id'];
  delete essayD['studentId'];
  delete essayD['teacherId'];
  const foundEssay = await prismaClient.essay.update({
    where: { id },
    data: {
      ...essayD,
      ...(essayData.teacherId ? ({
        teacher: {
          connect: {
            id: essayData.teacherId,
          }
        }
      }): ({})),
    },
  }
  );
  return NextResponse.json(foundEssay, { status: 200 });
}
