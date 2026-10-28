export const site = {
  name: "Bun & Brownie",
  handle: "@bun_and_brownie",
  tagline: "Fresh buns, rich brownies, warm hearts.",
  about:
    "Bun & Brownie is a local bakery and dessert home-venture in Tumkur (Tumakuru), known for fresh buns, maska buns, fudgy brownies, and tiramisu tins.",
  city: "Tumkur",
  cityAlt: "Tumakuru",
  address:
    "1st Cross, Kyathsandra, Subhash Nagar (Kotitopu), Near Anjanaya Temple, Tumkur, Karnataka",
  addressShort: "Kyathsandra, Kotitopu · Near Anjanaya Temple",
  mapsQuery:
    "1st Cross Kyathsandra Subhash Nagar Kotitopu Near Anjanaya Temple Tumkur",
  phoneDisplay: "9036393096",
  whatsapp: "https://wa.me/919036393096",
  whatsappLabel: "Order on WhatsApp",
  swiggy:
    "https://www.swiggy.com/city/tumakuru/bun-and-brownie-kotitopu-rest1420054",
  zomato: "https://www.zomato.com/tumkur/bun-and-brownie-tumkur-locality",
  fssai: "FSSAI certified",
  combo: {
    title: "Tiramisu + Brownie Tin",
    price: "₹300",
    note: "Home delivery in Tumkur · delivery charges apply",
  },
  menu: [
    { name: "Maska Bun", price: "₹50", line: "Soft, buttery classic." },
    { name: "Maska Jam Bun", price: "₹50", line: "Buttery bun with sweet jam." },
    {
      name: "Maska Choco Bun",
      price: "₹60",
      line: "Maska bun with a chocolate finish.",
    },
    {
      name: "Maska Nutella Bun",
      price: "₹70",
      line: "Warm bun filled with Nutella.",
    },
    {
      name: "Nutella Choco Bun",
      price: "₹75",
      line: "Chocolate + Nutella in one bite.",
    },
    {
      name: "Tiramisu + Brownie Tin",
      price: "₹300",
      line: "Our signature combo tin.",
    },
  ],
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
