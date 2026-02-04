import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Leaf, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/shared/Card";
import { Button } from "../components/shared/Button";
import { demoRooms } from "../data/rooms";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const stats = [
  { label: "Acres of farmland", value: 42 },
  { label: "Signature experiences", value: 18 },
  { label: "Guest satisfaction", value: 98 }
];

const testimonials = [
  {
    quote: "A serene escape with impeccable details.",
    author: "Maya L."
  },
  {
    quote: "Every moment felt curated and restorative.",
    author: "Jordan S."
  },
  {
    quote: "The most calming stay we've had all year.",
    author: "Tessa K."
  }
];

export const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [widgetRange, setWidgetRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-forest-50">
      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            alt="Farm landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>
        <div className="relative z-10 flex min-h-[85vh] flex-col justify-center px-6 py-20 text-white md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.3em]"
          >
            <Leaf className="h-4 w-4 text-gold-300" /> Premium Nature Resort
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl font-display text-4xl md:text-6xl"
          >
            Find your quiet luxury retreat at GreenNest Farm Stay.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-base text-forest-100"
          >
            Boutique rooms, immersive farm experiences, and curated stays designed for rest, romance, and reconnection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              Book your stay <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/60"
            >
              Explore rooms
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-3xl rounded-3xl bg-white/15 p-6 backdrop-blur-xl"
          >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <CalendarDays className="h-5 w-5 text-gold-300" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-forest-100">Check in</p>
                  <p className="text-sm font-semibold">Pick date</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <CalendarDays className="h-5 w-5 text-gold-300" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-forest-100">Check out</p>
                  <p className="text-sm font-semibold">Pick date</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <Sparkles className="h-5 w-5 text-gold-300" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-forest-100">Guests</p>
                  <p className="text-sm font-semibold">2 Adults</p>
                </div>
              </div>
            <Button className="w-full">Check availability</Button>
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
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">About GreenNest</p>
            <h2 className="font-display text-3xl text-forest-900">
              A modern farm stay designed for deep rest and slow, luxurious days.
            </h2>
            <p className="text-forest-600">
              Our boutique estate blends heritage barns, hand-tended gardens, and curated wellness rituals. Guests can
              explore chef-led farm dinners, pasture walks, and restorative yoga on the creek.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-3xl font-semibold text-forest-900"
                  >
                    {stat.value}+
                  </motion.p>
                  <p className="text-xs uppercase tracking-widest text-forest-500">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="space-y-4">
            <h3 className="font-display text-xl">Availability Widget</h3>
            <div className="space-y-3 text-sm text-forest-600">
              <div className="flex items-center justify-between rounded-2xl bg-forest-50 px-4 py-3">
                <span>Meadow Suite</span>
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs">4 nights open</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-forest-50 px-4 py-3">
                <span>Orchard Cabin</span>
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs">7 nights open</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-forest-50 px-4 py-3">
                <span>Brookside Loft</span>
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs">2 nights open</span>
              </div>
            </div>
            <div className="rounded-2xl border border-forest-100 bg-white/80 p-2">
              <DayPicker mode="range" selected={widgetRange} onSelect={setWidgetRange} numberOfMonths={1} />
            </div>
            <Button className="w-full">Check Availability</Button>
          </Card>
        </motion.div>
      </section>

      <section className="section-padding pt-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Featured Rooms</p>
              <h2 className="font-display text-3xl text-forest-900">Stay in airy suites and artisan cabins.</h2>
            </div>
            <Link to="/rooms" className="text-sm font-semibold text-forest-600">
              See all rooms
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {demoRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={fadeUp}
                className="min-w-[280px] max-w-[320px] flex-shrink-0"
              >
                <div className="glass-card overflow-hidden rounded-3xl">
                  <div className="group relative h-48 overflow-hidden">
                    <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold">
                      ${room.pricePerNight}/night
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-display text-lg">{room.name}</h3>
                    <p className="text-sm text-forest-600">{room.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="section-padding pt-0">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card>
            <h3 className="font-display text-xl">Farm Experiences</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { label: "Sunrise harvest", tip: "Early morning tours with the farm team." },
                { label: "Farm-to-table tasting", tip: "Seasonal tasting menu curated by our chef." },
                { label: "Creekside yoga", tip: "Slow flow sessions by the river." },
                { label: "Golden hour picnic", tip: "Private picnic with curated baskets." }
              ].map((item) => (
                <Tooltip.Provider key={item.label}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div className="flex cursor-pointer items-center gap-3 rounded-2xl bg-forest-50 px-3 py-3">
                        <div className="rounded-full bg-forest-100 p-2 text-forest-600">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-forest-700">{item.label}</span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="rounded-xl bg-forest-900 px-3 py-2 text-xs text-white">
                      {item.tip}
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="font-display text-xl">Guest Testimonials</h3>
            <div className="relative mt-4 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.quote}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{
                    opacity: index === activeTestimonial ? 1 : 0,
                    x: index === activeTestimonial ? 0 : -40
                  }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-2xl bg-white/70 p-4 ${index === activeTestimonial ? "relative" : "absolute"}`}
                >
                  <div className="flex items-center gap-2 text-gold-400">
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-sm text-forest-700">“{testimonial.quote}”</p>
                  <p className="mt-2 text-xs text-forest-500">— {testimonial.author}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <Card className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-forest-900">Ready to design your farm stay escape?</h2>
            <p className="mt-2 text-sm text-forest-600">
              Secure your preferred dates and let our host team curate the details.
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            Book your stay <CheckCircle2 className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </div>
  );
};
