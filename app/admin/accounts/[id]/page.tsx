import { redirect } from "next/navigation";
import { fetchAccountById } from "../../actions/accounts";
import AccountDetailClient from "./AccountDetailClient";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchAccountById(id);

  if (!result.success) {
    if (result.error?.startsWith("Unauthorized")) {
      redirect("/admin");
    }
    return (
      <div className="shadow-surface p-12 text-center">
        <p className="text-mute">{result.error ?? "Account not found"}</p>
      </div>
    );
  }

  return <AccountDetailClient account={result.data} />;
}

export const metadata = {
  title: "Account Detail - Admin Portal",
  description: "View and manage a user account",
};
