import SignUpForm from "@digifarm/components/sign-up/sign-up-form";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <SignUpForm />;
      </div>
    </section>
  );
}
