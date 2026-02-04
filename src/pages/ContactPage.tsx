import { useForm } from "react-hook-form";
import { Button } from "../components/shared/Button";

export const ContactPage = () => {
  const { register, handleSubmit, reset } = useForm();

  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Contact</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Let’s plan your stay.</h1>
        <p className="mt-3 text-forest-600">
          Tell us what you are celebrating and we will customize every detail.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <form
          onSubmit={handleSubmit(() => reset())}
          className="glass-card space-y-4 rounded-3xl p-6"
        >
          <label className="block text-sm font-medium text-forest-700">
            Name
            <input className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3" {...register("name")} />
          </label>
          <label className="block text-sm font-medium text-forest-700">
            Email
            <input type="email" className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3" {...register("email")} />
          </label>
          <label className="block text-sm font-medium text-forest-700">
            Message
            <textarea className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3" rows={5} {...register("message")} />
          </label>
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </form>
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-display text-xl text-forest-900">Reach us</h3>
            <p className="mt-2 text-sm text-forest-600">+1 (503) 555-0198</p>
            <p className="text-sm text-forest-600">hello@greennestfarmstay.com</p>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <div className="flex h-64 items-center justify-center bg-forest-100 text-sm text-forest-600">
              Google Maps Embed Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
