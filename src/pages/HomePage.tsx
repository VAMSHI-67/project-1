import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Landmark, MapPinned, MessageCircle, Droplet, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/shared/Card";
import { galleryImages, heroImage, siteConfig, whatsappBookingLink } from "../data/site";
import {
  subscribeActiveVenues,
  subscribeHeroImages,
  subscribeSecondaryImages,
  subscribeWalkthroughImages
} from "../lib/firestore";
import { getCloudinaryImageUrl } from "../lib/storage";
import { Venue } from "../lib/types";

type ImageAsset = {
  src: string;
  displaySrc: string;
  alt: string;
  caption?: string;
  srcSet?: string;
  sizes?: string;
};

type SecondaryAsset = ImageAsset & {
  venueId?: string;
};

type GalleryVariant = "hero" | "walkthrough" | "secondary";

type VariantConfig = {
  widths: number[];
  displayWidth: number;
  sizes: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const imageConfigs: Record<GalleryVariant, VariantConfig> = {
  hero: {
    widths: [960, 1440, 1920, 2560],
    displayWidth: 2560,
    sizes: "100vw"
  },
  walkthrough: {
    widths: [768, 1024, 1440, 1800],
    displayWidth: 1800,
    sizes: "100vw"
  },
  secondary: {
    widths: [480, 768, 1200],
    displayWidth: 1200,
    sizes: "(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 92vw"
  }
};

const buildResponsiveAsset = (
  src: string,
  alt: string,
  caption: string | undefined,
  variant: GalleryVariant
): ImageAsset => {
  const config = imageConfigs[variant];
  const isCloudinaryAsset = src.includes("/upload/");

  if (!isCloudinaryAsset) {
    return {
      src,
      displaySrc: src,
      alt,
      caption
    };
  }

  return {
    src,
    displaySrc: getCloudinaryImageUrl(src, {
      width: config.displayWidth,
      crop: "limit",
      quality: "auto",
      format: "auto"
    }),
    srcSet: config.widths
      .map(
        (width) =>
          `${getCloudinaryImageUrl(src, { width, crop: "limit", quality: "auto", format: "auto" })} ${width}w`
      )
      .join(", "),
    sizes: config.sizes,
    alt,
    caption
  };
};

const nearbyScenicSpots = [
  {
    name: "Wargal Saraswati Temple",
    category: "Religious",
    highlight: "Hilltop temple with peaceful vibes",
    distance: "6.4 km (~13 mins)",
    icon: Landmark
  },
  {
    name: "Kondapochamma Sagar Reservoir",
    category: "Reservoir/Scenic",
    highlight: "Sunset views and long dam walks",
    distance: "12.2 km (~20 mins)",
    icon: Waves
  },
  {
    name: "Shamirpet Lake",
    category: "Nature/Lake",
    highlight: "Rocky shoreline and picnic spots",
    distance: "23.7 km (~28 mins)",
    icon: Droplet
  }
];

const highlights = [
  "Nice ambience and perfect for groups of 16-20 people.",
  "Well-maintained property and supportive management.",
  "Great greenery, clean rooms, tasty food, and friendly staff."
];

export const HomePage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [walkthroughImages, setWalkthroughImages] = useState<ImageAsset[]>(
    galleryImages.map((image) => buildResponsiveAsset(image.src, image.alt, undefined, "walkthrough"))
  );
  const [secondaryImages, setSecondaryImages] = useState<SecondaryAsset[]>([]);
  const [heroImages, setHeroImages] = useState<ImageAsset[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeActiveVenues(setVenues);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeWalkthroughImages((items) => {
      if (!items.length) {
        setWalkthroughImages(
          galleryImages.map((image) => buildResponsiveAsset(image.src, image.alt, undefined, "walkthrough"))
        );
        return;
      }
      setWalkthroughImages(
        items.map((item) =>
          buildResponsiveAsset(
            item.url,
            item.caption || "Kanvera property walkthrough image",
            item.caption,
            "walkthrough"
          )
        )
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSecondaryImages((items) => {
      setSecondaryImages(
        items.map((item) => ({
          ...buildResponsiveAsset(item.url, item.caption || "Venue gallery image", item.caption, "secondary"),
          venueId: item.venueId
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeHeroImages((items) => {
      setHeroImages(
        items.map((item) =>
          buildResponsiveAsset(
            item.url,
            item.caption || "Kanvera Resort and Convention hero image",
            item.caption,
            "hero"
          )
        )
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [walkthroughImages.length]);

  useEffect(() => {
    if (walkthroughImages.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % walkthroughImages.length);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [walkthroughImages.length]);

  const heroAsset = useMemo(
    () =>
      heroImages[0] ?? buildResponsiveAsset(heroImage.src, heroImage.alt, undefined, "hero"),
    [heroImages]
  );
  const activeAsset = walkthroughImages[activeIndex];

  const secondarySections = useMemo(() => {
    if (!secondaryImages.length) {
      return [] as { id: string; title: string; purpose?: string; images: SecondaryAsset[] }[];
    }

    const venueMap = new Map(venues.map((venue) => [venue.id, venue]));
    const groups = new Map<string, { id: string; title: string; purpose?: string; images: SecondaryAsset[] }>();

    secondaryImages.forEach((image) => {
      const venue = image.venueId ? venueMap.get(image.venueId) : undefined;
      const key = venue?.id ?? "general";
      const existing = groups.get(key);
      if (existing) {
        existing.images.push(image);
        return;
      }
      groups.set(key, {
        id: key,
        title: venue?.name ?? "More from Kanvera",
        purpose: venue?.purpose,
        images: [image]
      });
    });

    return Array.from(groups.values());
  }, [secondaryImages, venues]);

  return (
    <div className="bg-forest-50">
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroAsset.displaySrc}
            srcSet={heroAsset.srcSet}
            sizes={heroAsset.sizes}
            alt={heroAsset.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-20 text-white md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm uppercase tracking-[0.3em] text-gold-200"
          >
            Venue Booking Across One Private Property
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl font-display text-4xl md:text-6xl"
          >
            Escape to {siteConfig.brand.name}, a private green retreat in Telangana.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-forest-100"
          >
            Explore stay spaces, celebration zones, and event-ready corners across the Kanvera property, then choose the
            venue that fits your plan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href={whatsappBookingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" /> Book Now on WhatsApp
            </a>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/60"
            >
              Plan your stay <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-12 grid gap-4 rounded-3xl bg-white/15 p-6 backdrop-blur-xl md:grid-cols-4"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-forest-100">Rating</p>
              <p className="text-lg font-semibold text-white">4.4 stars</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-forest-100">Reviews</p>
              <p className="text-lg font-semibold text-white">263+ guests</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-forest-100">Venue Types</p>
              <p className="text-lg font-semibold text-white">Stay, events, conventions</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-forest-100">Minimum Duration</p>
              <p className="text-lg font-semibold text-white">12 hours</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-10 lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">About {siteConfig.brand.name}</p>
            <h2 className="font-display text-3xl text-forest-900">
              Peaceful greenery, cozy stay zones, event corners, and open lawns for unforgettable gatherings.
            </h2>
            <p className="text-forest-600">
              Located near Gowraram, {siteConfig.brand.name} spans a large private property where each venue serves a
              different purpose while staying part of one shared property experience.
            </p>
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <Card key={highlight} className="border border-forest-100 bg-white/80 py-4">
                  <p className="text-sm text-forest-700">"{highlight}"</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="space-y-4">
            <h3 className="font-display text-xl">Location Snapshot</h3>
            <p className="text-sm text-forest-600">{siteConfig.contact.address}</p>
            <p className="text-sm text-forest-600">Plus code: {siteConfig.contact.plusCode}</p>
            <a
              href={siteConfig.contact.mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white"
            >
              <MapPinned className="h-4 w-4" /> Get Directions
            </a>
          </Card>
        </motion.div>
      </section>

      <section className="section-padding pt-0">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Walkthrough</p>
            <h2 className="font-display text-3xl text-forest-900">A guided look around {siteConfig.brand.name}</h2>
          </div>
        </div>
        {activeAsset && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-forest-200/80 bg-white shadow-[0_24px_60px_rgba(15,44,34,0.12)]">
              <div className="relative flex min-h-[420px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_38%),linear-gradient(135deg,rgba(245,249,246,1),rgba(255,255,255,0.98),rgba(246,239,221,0.72))] px-8 py-6 md:min-h-[520px] md:px-12">
                <div className="pointer-events-none absolute inset-y-8 left-6 w-px bg-gradient-to-b from-transparent via-forest-200/80 to-transparent md:left-8" />
                <div className="pointer-events-none absolute inset-y-8 right-6 w-px bg-gradient-to-b from-transparent via-forest-200/80 to-transparent md:right-8" />
                <div className="pointer-events-none absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-gold-200/80 to-transparent md:inset-x-16" />
                <div className="pointer-events-none absolute inset-x-10 bottom-6 h-px bg-gradient-to-r from-transparent via-gold-200/70 to-transparent md:inset-x-16" />
                <img
                  src={activeAsset.displaySrc}
                  srcSet={activeAsset.srcSet}
                  sizes={activeAsset.sizes}
                  alt={activeAsset.alt}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 max-h-[420px] w-full object-contain drop-shadow-[0_18px_35px_rgba(15,44,34,0.14)] md:max-h-[520px]"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-forest-600">
                {activeAsset.caption || "Explore the stay zones, lawns, and gathering spaces across the Kanvera property."}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((current) =>
                      current === 0 ? walkthroughImages.length - 1 : current - 1
                    )
                  }
                  className="rounded-full border border-forest-200 px-4 py-2 text-xs font-semibold text-forest-700"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current + 1) % walkthroughImages.length)}
                  className="rounded-full bg-forest-700 px-4 py-2 text-xs font-semibold text-white"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {walkthroughImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === activeIndex ? "bg-forest-700" : "bg-forest-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="section-padding pt-0 space-y-10">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Gallery</p>
            <h2 className="font-display text-3xl text-forest-900">Browse the property by venue</h2>
          </div>
        </div>
        {secondarySections.length > 0 ? (
          secondarySections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div>
                <h3 className="font-display text-2xl text-forest-900">{section.title}</h3>
                {section.purpose && <p className="mt-1 text-sm text-forest-600">{section.purpose}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.images.map((image) => (
                  <div
                    key={`${section.id}-${image.src}`}
                    className="group overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-[0_18px_40px_rgba(15,44,34,0.08)]"
                  >
                    <div className="flex min-h-[16rem] items-center justify-center bg-gradient-to-br from-forest-50 via-white to-gold-50/40 p-3 sm:min-h-[18rem] lg:min-h-[20rem]">
                      <img
                        src={image.displaySrc}
                        srcSet={image.srcSet}
                        sizes={image.sizes}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[21rem] w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    {image.caption && <p className="px-4 pb-4 text-sm text-forest-600">{image.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="border border-forest-100 bg-white/80 py-6 text-center text-forest-600">
            Venue-specific gallery images will appear here once they are uploaded from the admin media library.
          </Card>
        )}
      </section>

      <section className="section-padding pt-0">
        <div className="rounded-3xl border border-forest-100 bg-white/90 p-6 md:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Nearby Scenic Spots</p>
          <h2 className="mt-2 font-display text-3xl text-forest-900">Quick drives for peaceful day trips.</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {nearbyScenicSpots.map((spot) => (
              <div key={spot.name} className="rounded-2xl border border-forest-100 bg-forest-50 p-5">
                <spot.icon className="h-5 w-5 text-forest-600" />
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{spot.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-forest-500">{spot.category}</p>
                  </div>
                  <p className="text-sm text-forest-600">{spot.highlight}</p>
                  <p className="text-xs font-semibold text-forest-700">{spot.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
