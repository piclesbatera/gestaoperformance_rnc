if ((process.env.NODE_ENV || '').trim() == 'production') {
	module.exports = {
		outputDir: '../gestaoperformance_rnc_api/app/main/templates',
		indexPath: './index.html',
		assetsDir: '../static'
	}
}