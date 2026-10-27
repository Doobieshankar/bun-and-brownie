import { mapsUrl, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-on-ink/10 bg-ink text-on-ink">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-12 md:grid-cols-3 md:px-10 xl:px-16">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
            {site.name}
          </p>
          <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-on-ink/60">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-on-ink/50">
            {site.about}
          </p>
        </div>

        <div className="text-sm text-on-ink/60">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-on-ink/40 uppercase">
            Find us
          </p>
          <p className="mt-3 max-w-[34ch] leading-relaxed">{site.address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex transition-colors hover:text-accent"
          >
            Google Maps
          </a>
        </div>

        <div className="text-sm text-on-ink/60">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-on-ink/40 uppercase">
            Order
          </p>
          <p className="mt-3">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              WhatsApp {site.phoneDisplay}
            </a>
          </p>
          <p className="mt-2">
            <a
              href={site.swiggy}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              Swiggy
            </a>
            {" · "}
            <a
              href={site.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              Zomato
            </a>
          </p>
          <p className="mt-2">{site.handle}</p>
          <p className="mt-8 text-xs text-on-ink/40">
            © 2026 {site.name} · {site.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
