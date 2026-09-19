import { AboutProfile } from "@/components/about-profile"

export default function AboutPage() {
  return (
    <main className="relative z-10">
      <div className="mx-auto max-w-5xl px-6 pt-20 sm:px-8 sm:pt-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">About</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#F2F2F2] sm:text-5xl">Arjun · əɾ.d͡ʒʊn</h1>
      </div>

      <AboutProfile />
    </main>
  )
}
