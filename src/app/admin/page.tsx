import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getFeaturedCombo, getAllProducts, fallbackCombo, fallbackMenu } from "@/lib/content";
import { hasDatabase } from "@/db";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const instant = false;

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  let products = fallbackMenu;
  let combo = fallbackCombo;
  let dbReady = hasDatabase();

  if (dbReady) {
    try {
      products = await getAllProducts();
      combo = await getFeaturedCombo();
    } catch (error) {
      console.error("admin load failed", error);
      dbReady = false;
    }
  }

  return (
    <AdminDashboard
      initialProducts={products}
      initialCombo={combo}
      dbReady={dbReady}
    />
  );
}
