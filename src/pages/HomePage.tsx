import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Landmark,
  MapPinned,
  MessageCircle,
  Droplet,
  Waves
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/shared/Card";
import { galleryImages, heroImage, siteConfig, whatsappBookingLink } from "../data/site";
import { subscribeHeroImages, subscribeSecondaryImages, subscribeWalkthroughImages } from "../lib/firestore";

type WalkthroughAsset = {
  src: string;
  alt: string;
  caption?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
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
  const [walkthroughImages, setWalkthroughImages] = useState<WalkthroughAsset[]>(galleryImages);
  const [secondaryImages, setSecondaryImages] = useState<WalkthroughAsset[]>(galleryImages);
  const [heroImages, setHeroImages] = useState<WalkthroughAsset[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeWalkthroughImages((items) => {
      if (!items.length) {
        setWalkthroughImages(galleryImages);
        return;
      }
      setWalkthroughImages(
        items.map((item) => ({
          src: item.url,
          alt: item.caption || "Farmhouse walkthrough image",
          caption: item.caption
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSecondaryImages((items) => {
      if (!items.length) {
        setSecondaryImages(galleryImages);
        return;
      }
      setSecondaryImages(
        items.map((item) => ({
          src: item.url,
          alt: item.caption || "Farmhouse gallery image",
          caption: item.caption
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeHeroImages((items) => {
      setHeroImages(
        items.map((item) => ({
          src: item.url,
          alt: item.caption || "Kanvera Farms hero image",
          caption: item.caption
        }))
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

  const heroAsset = useMemo(() => heroImages[0] ?? heroImage, [heroImages]);
  const activeAsset = walkthroughImages[activeIndex];

  return (
    <div className="bg-forest-50">
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroAsset.src} alt={heroAsset.alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-20 text-white md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm uppercase tracking-[0.3em] text-gold-200"
          >
            Full Property Farmstay Booking
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
            Book the entire farmstay for your family trips, group hangouts, or special celebrations. Minimum
            duration starts at 12 hours, and you can extend to multi-day stays.
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
              <p className="text-xs uppercase tracking-widest text-forest-100">Booking Style</p>
              <p className="text-lg font-semibold text-white">Whole Farmstay</p>
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
              Peaceful greenery, cozy stay zones, poolside fun, and open lawns for unforgettable weekends.
            </h2>
            <p className="text-forest-600">
              Located near Gowraram, {siteConfig.brand.name} is designed for group stays where everyone can relax,
              celebrate, and reconnect with nature in one private property.
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
            <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
              <img
                src={activeAsset.src}
                alt={activeAsset.alt}
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-forest-600">
                {activeAsset.caption || "Explore the farmhouse spaces, lawns, and gathering spots."}
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

      <section className="section-padding pt-0">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Gallery</p>
            <h2 className="font-display text-3xl text-forest-900">More scenes from the property</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryImages.map((image) => (
            <div key={image.src} className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
              <img
                src={image.src}
                alt={image.alt}
                className="h-56 w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
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
