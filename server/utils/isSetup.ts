import { Crate } from '../models/crate'
import { Link } from '../models/link'

export const isSetup = async () => {
	const links = await Link.find({}, 1)
	const crates = await Crate.find({}, 3)

	// Assume not setup when no links exist and we have fewer than 3 crates (2 are created during welcome)
	if (links.length === 0 && crates.length < 3) {
		return false
	}

	return true
}