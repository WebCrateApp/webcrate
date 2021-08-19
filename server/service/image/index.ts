
import path from 'path'
import chromium from 'chrome-aws-lambda'
import ejs from 'ejs'

import { isDev, domain } from '../../utils/variables'

// Use different options depending on the environment
const getOptions = async () => {
	if (isDev) {
		// Path to local chrome executable on different platforms
		const chromeExecutables: { [key: string]: string } = {
			linux: '/usr/bin/chromium-browser',
			win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
			darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
		}

		return {
			args: [ '--no-sandbox' ],
			executablePath: chromeExecutables[process.platform] || chromeExecutables.linux,
			headless: true
		}
	}

	// Else, use the path of chrome-aws-lambda and its args
	return {
		args: chromium.args,
		executablePath: await chromium.executablePath,
		headless: chromium.headless
	}
}

export const generateSocialImage = async (title: string, description: string, icon: string) => {
	// Inflate chrome and get options
	const opts = await getOptions()

	// Load noto-emoji font
	await chromium.font(path.join(__dirname, 'NotoColorEmoji.ttf'))

	// Launch browser
	const browser = await chromium.puppeteer.launch(opts)

	// Create new page
	const page = await browser.newPage()
	await page.setViewport({
		width: 1200,
		height: 628
	})

	// Load the template into the page
	const data = { title, description, icon, domain }
	const html = await ejs.renderFile(path.join(__dirname, '../../views/', 'image.ejs'), data)
	await page.setContent(html, { waitUntil: 'domcontentloaded' })

	// Take a screenshot of the page
	const image = await page.screenshot()

	await browser.close()

	return image
}