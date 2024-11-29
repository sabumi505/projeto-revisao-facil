import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EssayContent } from "@digifarm/components/essay/essay-content";
import { nextAuthOptions } from "@digifarm/lib/auth/options";

type Params = Promise<{ id: string }>;

export default async function EssayPage(props: { params: Params }) {
  // @ts-ignore
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/auth");
  }

  const essayId = (await props.params).id;
  // @ts-ignore
  const isTeacher = session.user.role === "teacher";

  return <EssayContent essayId={essayId}  isTeacher={isTeacher}/>;
}
