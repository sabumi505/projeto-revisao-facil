import { EssayStatus, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

export async function POST(request: Request) {
  const { content, title, studentId } = await request.json();
  try {
    const createdEssay = await prismaClient.essay.create({
      data: {
        content,
        title,
        studentId,
        status: EssayStatus.CREATED,
      },
    });
    return NextResponse.json({...createdEssay}, { status: 201 });
  } catch (error) {
    console.log({
      message: 'failed to create essay',
      // @ts-ignore
      error: error.message,
      title,
      studentId,
    });
    // @ts-ignore
    return NextResponse.json({ error: `failed to create essay, got ${error.message}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get('studentId');
  if (studentId) {
    return findStudentEssays(studentId);
  }
  return NextResponse.json({ ok: studentId ?? "ok" }, { status: 200 });
}

async function findStudentEssays(studentId: string) {
  try {
    const studentEssays = await prismaClient.essay.findMany({
      where: {
        studentId,
      },
      include: {
        teacher: true,
      },
    });
    return NextResponse.json({
      data: (studentEssays ?? []),
    }, { status: 200 });
  } catch (error) {
    console.log(JSON.stringify({
      message: 'failed to list student essays',
      // @ts-ignore
      error: error.message,
      studentId,
    }));
    // @ts-ignore
    return NextResponse.json({ error: `failed to collect student essays, got ${error.message}`}, { status: 500 });
  }
}
