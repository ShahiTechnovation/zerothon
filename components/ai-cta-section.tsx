"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Code2, Rocket } from "lucide-react"
import Link from "next/link"

export function AICTASection() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/80">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
          
          {/* Main CTA Card */}
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">Start Building Today</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Ready to Build Your
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Next-Gen dApp?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-slate-300 max-w-3xl mx-auto mb-12"
              >
                Join thousands of developers building the future of Web3 with PyVax AI.
                <br />
                No Solidity required. Just your ideas and Python.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              >
                <Link href="/pyvax-ai">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg shadow-blue-500/25"
                  >
                    <Rocket className="w-5 h-5" />
                    Launch AI Builder
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/playground">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2"
                  >
                    <Code2 className="w-5 h-5" />
                    Try Playground
                  </motion.button>
                </Link>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">Free</div>
                  <div className="text-slate-400 text-sm">Start building with no credit card required</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">Open Source</div>
                  <div className="text-slate-400 text-sm">Full transparency and community-driven</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-pink-400 mb-2">24/7 Support</div>
                  <div className="text-slate-400 text-sm">AI-powered assistance whenever you need</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 text-slate-500 text-sm"
        >
          Powered by Avalanche • Built with ❤️ for Python Developers
        </motion.div>
      </div>
    </section>
  )
}
