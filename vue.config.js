if ((process.env.NODE_ENV || '').trim() == 'production') {
	module.exports = {
		publicPath: '/sgq/',
		outputDir: '../gestaoperformance_rnc_api/app/main/templates',
		indexPath: './index.html',
		assetsDir: '../static'
	}
}