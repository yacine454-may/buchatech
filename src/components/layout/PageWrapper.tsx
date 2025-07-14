import { motion } from "framer-motion";
import { slideUp } from "../animations/variants";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = "" }: PageWrapperProps) => {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={className}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
