export const siteName = 'Balance'
export const siteUrl = 'https://www.balanceanalytics.io/'
export const siteTitle = 'Balance Analytics'
export const siteDescription =
	'BALANCE - a Blockchain Intelligence app dedicated to supporting the Cardano Blockchain Ecosystem'
export const siteImage = `${siteUrl}social.png`
export const postImage = 'https://balance-social-image.vercel.app/'

export const twitterHandle = '@BalanceData22'
export const twitter = 'https://twitter.com/BalanceData22'
export const youtube = ''
export const github = 'https://github.com/perchlabs-io'
export const matrix = 'https://matrix.to/#/#general:forum.balanceanalytics.io'

export const api = 'https://api.github.com'
export const owner = 'perchlabs-io'
export const repo = 'balance-media'
export const path = 'posts'

export const categories = {
	development: 'Development',
	announcements: 'Announcements',
	pool_landscape: 'Pool Landscape'
	
}

export const chartBoards = {
	decentralization: 'Decentralization',
	donut_shop: 'Donut Shop',
	utxo_allocation: 'UTxO Allocation',
	// stake_flow: "Stake Flow"
	
}

// https://api.github.com/repos/user/repo/contents/data/posts.json
export const postsDataUrl = `${api}/repos/${owner}/${repo}/contents/data/posts.json`

// https://api.github.com/repos/user/repo/contents/posts
export const postsUrl = `${api}/repos/${owner}/${repo}/contents/${path}`

// https://github.com/user/repo/blob/main/posts
export const fileUrl = `https://github.com/${owner}/${repo}/blob/main/posts`

// https://raw.githubusercontent.com/user/repo/main/posts/post-slug/images/image.webp
export const imagesUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/posts`
