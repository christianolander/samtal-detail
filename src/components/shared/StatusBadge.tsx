 /**
 * StatusBadge Component
 *
 * Displays conversation status with semantic colors and smooth animation on change
 */

interface StatusBadgeProps {
  status: 'planerad' | 'ej_bokad' | 'bokad' | 'klar'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'planerad':
        return 'bg-[#f3f4f6] text-[#374151]' // gray-100/700
      case 'ej_bokad':
        return 'bg-[#ffedd5] text-[#c2410c]' // orange-100/700
      case 'bokad':
        return 'bg-[#dbeafe] text-[#1d4ed8]' // blue-100/700
      case 'klar':
        return 'bg-[#dcfce7] text-[#15803d]' // green-100/700
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'planerad':
        return 'Planerad'
      case 'ej_bokad':
        return 'Ej bokad'
      case 'bokad':
        return 'Bokad'
      case 'klar':
        return 'Klar'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getStatusStyles()}`}
      key={status} // Force re-render for animation
    >
      {getStatusLabel()}
    </span>
  )
}
