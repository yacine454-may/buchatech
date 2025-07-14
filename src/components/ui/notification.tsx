import { useEffect } from "react"
import { Alert } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationProps {
  message: string
  type: NotificationType
  onClose: () => void
  duration?: number
}

export function Notification({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const alertVariant = type === "error" ? "destructive" : type

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <Alert variant={alertVariant} className="min-w-[300px] shadow-lg">
          {message}
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}
