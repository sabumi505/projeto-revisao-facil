import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teacherId = searchParams.get('teacherId');
  if (teacherId) {
    return findStudentEssays(teacherId);
  }
  return NextResponse.json({ ok: teacherId ?? "ok" }, { status: 200 });
}

async function findStudentEssays(teacherId: string) {
  try {
    const studentEssays = await prismaClient.essay.findMany({
      where: {
        teacherId,
      },
      include: {
        student: true,
        teacher: true,
      }
    });
    return NextResponse.json({
      data: (studentEssays ?? []),
    }, { status: 200 });
  } catch (error) {
    console.log(JSON.stringify({
      message: 'failed to list teacher essays',
      // @ts-ignore
      error: error.message,
      teacherId,
    }));
    // @ts-ignore
    return NextResponse.json({ error: `failed to collect teacher essays, got ${error.message}`}, { status: 500 });
  }
}
