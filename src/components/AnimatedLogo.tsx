import { motion } from "framer-motion";

const AnimatedLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dimensions = { sm: 36, md: 44, lg: 64 };
  const s = dimensions[size];
  const fontSize = { sm: 14, md: 18, lg: 26 };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: s, height: s }}
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer ring */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{
              pathLength: { delay: 0.8, duration: 1.5, ease: "easeInOut" },
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            }}
          />
        </motion.svg>

        {/* Diamond accent */}
        <motion.div
          className="absolute -top-0.5 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div
            className="bg-primary rotate-45"
            style={{ width: s * 0.09, height: s * 0.09 }}
          />
        </motion.div>

        {/* CK Letters */}
        <motion.span
          className="font-serif font-bold text-primary tracking-tight relative z-10"
          style={{ fontSize: fontSize[size] }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          CK
        </motion.span>
      </motion.div>

      {/* Brand text */}
      <div className="flex flex-col leading-none">
        <motion.span
          className="font-serif font-bold text-primary tracking-wide"
          style={{ fontSize: fontSize[size] * 0.85 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Conciergerie
        </motion.span>
        <motion.span
          className="font-serif font-medium text-foreground tracking-[0.25em] uppercase"
          style={{ fontSize: fontSize[size] * 0.55 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Kénitra
        </motion.span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
