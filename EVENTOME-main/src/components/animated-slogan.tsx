"use client";

import { motion } from "framer-motion";

export default function AnimatedSlogan() {
  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <span className="inline-block animate-shimmer bg-[linear-gradient(110deg,#F5F5F5,45%,#0a0a0a,55%,#F5F5F5)] bg-[length:250%_100%] bg-clip-text text-transparent">
        Your Vision, Our Platform.
      </span>
    </motion.div>
  );
}
