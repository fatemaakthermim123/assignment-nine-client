import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

function Banner() {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden md:min-h-[600px]">
      {/* Wedding-themed background image */}
      <Image
        src="/banner.png"
        alt="Wedding-themed background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Banner content */}
      <div className="relative mx-auto flex min-h-[inherit] w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6">
        <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Make Your Dream Wedding Come True
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/90 sm:mt-6 sm:text-lg">
          Plan every detail of your special day with ease — from venues and
          catering to photography and florals, discover trusted vendors all in
          one place.
        </p>
        <Button
          size="lg"
          className="mt-8 h-11 px-10 text-base sm:h-12"
          nativeButton={false}
          render={<Link href="/services" />}
        >
          Explore Wedding Services
        </Button>
      </div>
    </section>
  )
}

export { Banner }
