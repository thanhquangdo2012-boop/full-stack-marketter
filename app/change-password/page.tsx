import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <ChangePasswordForm forced={member.mustChangePassword} />
      </div>
    </main>
  );
}
