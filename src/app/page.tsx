import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Combo } from "@/components/Combo";
import { Menu } from "@/components/Menu";
import { Order } from "@/components/Order";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Combo />
        <Menu />
        <Order />
      </main>
      <Footer />
    </>
  );
}
