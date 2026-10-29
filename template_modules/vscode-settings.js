import fs from 'fs'
import path from 'path'
import templateConfig from '../template.config.js'
import logger from './logger.js'

const isProduction = process.env.NODE_ENV === 'production'

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

export default function generateConfigFiles() {
	const aliases = templateConfig.aliases
	const aliasesSettings = {
		'path-autocomplete.pathMappings': Object.entries(aliases).reduce((acc, [key, value]) => {
			acc[key] = path.join('${folder}', value).replace(/\\+/g, '/')
			return acc
		}, {}),
	}
	const componentSettings = { "viteHtmlComponentCreator.defaultImports": { "html_imports": [`<link rel='stylesheet' href='${getKeyByValue(aliases, 'src/components')}/{component}/{component}.scss'>`], "scss_imports": [""] } }
	// Preserve workspace preferences (including the project Node terminal).
	const settingsPath = path.resolve('.vscode/settings.json')
	const existingSettings = fs.existsSync(settingsPath)
		? JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
		: {}
	const vscodeSettings = Object.assign({}, existingSettings, componentSettings, aliasesSettings)

	!fs.existsSync('.vscode') ? fs.mkdirSync('.vscode') : null
	fs.writeFileSync(path.resolve('.vscode/settings.json'), JSON.stringify(vscodeSettings, null, 2))

	!isProduction ? logger('Файл конфігурації шляхів створений') : null
}

