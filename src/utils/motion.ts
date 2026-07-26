import { type Variants, type Transition } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const springWarm: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const springSnap: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export const tabSlide: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const tabIndicator = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
};
