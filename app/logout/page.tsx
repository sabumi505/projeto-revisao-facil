import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ReviewLister from "@digifarm/components/home/lister";
import { nextAuthOptions } from "@digifarm/lib/auth/options";
import TeacherReviewLister from "@digifarm/components/home/teacher-lister";
import { LogoutComponent } from "@digifarm/components/logout/logout-page";

export default async function HomePage() {
  // @ts-ignore
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/auth");
  }

  return (<LogoutComponent />);
}
