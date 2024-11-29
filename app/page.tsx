import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ReviewLister from "@digifarm/components/home/lister";
import { nextAuthOptions } from "@digifarm/lib/auth/options";
import TeacherReviewLister from "@digifarm/components/home/teacher-lister";

export default async function HomePage() {
  // @ts-ignore
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/auth");
  }

  // @ts-ignore
  if (session.user.role === 'student') {
    return (<ReviewLister />);
  }
  return (<TeacherReviewLister />);
}
