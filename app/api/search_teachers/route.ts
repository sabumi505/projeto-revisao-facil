import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teacherEmail = searchParams.get('email');
  if (!teacherEmail) {
    return NextResponse.json({ error: 'teacher email must be informed' }, { status: 400 });
  }
  const foundTeachers = await prismaClient.teacher.findMany({
    where: {
      email: {
        startsWith: teacherEmail,
        mode: 'insensitive',
      }
    }
  });

  return NextResponse.json({ data: foundTeachers }, { status: 200 });
}
