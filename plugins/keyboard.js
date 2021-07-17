// Modifier keys
export const CTRL = 0b000001
export const ALT = 0b000010
export const SHIFT = 0b000100
export const META = 0b001000

// The Windows key
export const WIN = 0b010000

// The CMD key
export const CMD = 0b100000

// Check for macOS
const isMac = navigator.appVersion.includes('Macintosh')

// Determine the primary modifier key
export const PRIMARY = isMac ? CMD : CTRL

/**
 * Create a mixin for simple keyboard shortcuts
 *
 * @param {string|string[]} matcher         The key name(s) to react to
 * @param {number}          modifierKeys A bitmask of modifier keys
 * @returns {object}
 */
export default function shortcut(matcher, ...args) {
	// If only one remaining argument, treat it as callback
	if (args.length === 1) {
		return shortcut(matcher, 0b0000, args[0])
	}

	// The key the listener function will be stored at
	const LISTENER = Symbol('keydown listener')

	// eslint-disable-next-line prefer-const
	let [ modifierKeys, callback ] = args

	// Check modifier keys for WIN or CMD
	let excludedByOS = false
	if (modifierKeys & (WIN | CMD)) {
		// Add META to modifier keys if OS matches
		if (modifierKeys & (isMac ? CMD : WIN)) {
			modifierKeys = modifierKeys | META
		} else {
			excludedByOS = true
		}
	}

	// Normalize matcher towards a function
	if (typeof matcher === 'string') {
		matcher = [ matcher ]
	}
	if (Array.isArray(matcher)) {
		const lowerKeys = matcher.map((key) => key.toLowerCase())
		matcher = (event) => lowerKeys.includes(event.key.toLowerCase())
	}

	return {
		mounted() {
			this[LISTENER] = (event) => {
				if (
					// Check for exclusion by OS
					!excludedByOS &&
					// No explicitely focused element
					document.activeElement === document.body &&
					// Control key matches requirement
					event.ctrlKey === Boolean(modifierKeys & CTRL) &&
					// Alt key matches requirement
					event.altKey === Boolean(modifierKeys & ALT) &&
					// Shift key matches requirement
					event.shiftKey === Boolean(modifierKeys & SHIFT) &&
					// Meta key matches requirement
					event.metaKey === Boolean(modifierKeys & META) &&
					// Key name is the requested one
					matcher(event)
				) {
					callback.call(this, event)
				}
			}

			document.addEventListener('keydown', this[LISTENER])
		},
		destroyed() {
			document.removeEventListener('keydown', this[LISTENER])
		}
	}
}