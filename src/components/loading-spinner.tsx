import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      test
      {/* <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent" />
      </motion.div> */}
      <p className="mt-4 text-gray-400">Searching streaming services...</p>
    </div>
  );
}
