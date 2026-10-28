import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Combo } from "@/components/Combo";
import { Menu } from "@/components/Menu";
import { Order } from "@/components/Order";
import { Footer } from "@/components/Footer";
import { getActiveProducts, getFeaturedCombo, fallbackCombo, fallbackMenu } from "@/lib/content";

async function HomeContent() {
  const [menuItems, combo] = await Promise.all([
    getActiveProducts(),
    getFeaturedCombo(),
  ]);

  return (
    <>
      <Combo combo={combo} />
      <Menu items={menuItems} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense
          fallback={
            <>
              <Combo combo={fallbackCombo} />
              <Menu items={fallbackMenu} />
            </>
          }
        >
          <HomeContent />
        </Suspense>
        <Order />
      </main>
      <Footer />
    </>
  );
}
