// High-contrast, distinct color palette for maximum visibility and differentiation
// All colors are carefully chosen for accessibility and visual distinction
const COLORS = [
  '#2563EB', // Vibrant blue
  '#DC2626', // Bright red
  '#16A34A', // Fresh green
  '#EA580C', // Orange
  '#9333EA', // Purple
  '#0891B2', // Cyan
  '#CA8A04', // Amber/gold
  '#DB2777', // Pink
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#BE123C', // Rose
  '#0369A1', // Sky blue
  '#B91C1C', // Crimson
  '#0D9488', // Teal
  '#C026D3', // Fuchsia
  '#1D4ED8', // Blue (darker)
  '#15803D', // Green (darker)
  '#A855F7', // Purple (lighter)
  '#EF4444', // Red (lighter)
  '#10B981', // Green (lighter)
]

// Special vibrant color for "Food at home" category
const FOOD_AT_HOME_COLOR = '#DC2626' // Bright red for emphasis

/**
 * Get a consistent color for a category
 * @param {string} category - Category name
 * @param {number} index - Index of category in sorted list
 * @returns {string} Hex color code
 */
export function getCategoryColor(category, index) {
  if (category === 'Food at home') {
    return FOOD_AT_HOME_COLOR
  }
  return COLORS[index % COLORS.length]
}

/**
 * Generate color map for all categories
 * @param {string[]} categories - Sorted list of category names
 * @returns {Object} Map of category name to color
 */
export function generateColorMap(categories) {
  const sortedCategories = [...categories].sort()
  const colorMap = {}
  
  sortedCategories.forEach((category, index) => {
    colorMap[category] = getCategoryColor(category, index)
  })
  
  return colorMap
}

