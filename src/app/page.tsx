"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <BackgroundCanvas />

      <div className="relative z-10 flex min-h-screen flex-col px-6 md:px-12">
        <motion.header
          {...fadeIn(0.2)}
          className="flex items-center gap-2 py-8"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
          <span className="text-sm text-white/90">PROJECT LLMeta</span>
        </motion.header>

        <main className="flex flex-1 items-center justify-center">
          <div className="max-w-5xl">
            <motion.h1
              {...fadeIn(0.4)}
              className="mb-8 text-5xl font-light leading-tight tracking-tight md:text-7xl lg:text-8xl"
            >
              Intelligence{" "}
              <span className="bg-linear-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                Meets
              </span>{" "}
              Space
            </motion.h1>

            <motion.p
              {...fadeIn(0.6)}
              className="mb-14 max-w-2xl text-lg text-white/70 md:text-xl"
            >
              Where AI and the Metaverse converge to redefine communication
            </motion.p>

            <motion.div
              {...fadeIn(0.8)}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/experience"
                className="group inline-flex items-center justify-center gap-3 rounded bg-linear-to-r from-white/90 to-white/80 px-10 py-4 text-black shadow-2xl shadow-white/20 transition hover:from-white hover:to-white"
              >
                <span className="font-medium">Enter the World</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/30 px-10 py-4 text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                <span className="font-light">Learn More</span>
              </Link>
            </motion.div>
          </div>
        </main>

        <motion.footer
          {...fadeIn(1.2)}
          className="py-8 text-center text-xs text-white/40"
        >
          © 2025 — Takuya Uehara, All Rights Reserved.
        </motion.footer>
      </div>
    </div>
  );
}
