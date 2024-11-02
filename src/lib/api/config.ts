export const siteName = 'BALANCE'
export const siteUrl = 'https://www.balanceanalytics.io/'
export const siteTitle = 'Balance Analytics'
export const siteDescription =
	'BALANCE - a Blockchain Intelligence app dedicated to supporting the Cardano Blockchain Ecosystem'
export const siteImage = `${siteUrl}social.png`
export const postImage = 'https://balance-social-image.vercel.app/'

export const twitterHandle = '@BalanceData22'
export const twitter = 'https://x.com/BalanceData22'
export const youtube = ''
export const github = 'https://github.com/perchlabs-io'
export const matrix = 'https://matrix.to/#/#general:forum.balanceanalytics.io'

export const api = 'https://api.github.com'
export const owner = 'perchlabs-io'
export const repo = 'balance-media'
export const branch = 'main'
export const path = 'posts'

export const categories = {
	development: 'Development',
	announcements: 'Announcements',
	pool_landscape: 'Pool Landscape',
	group_update: 'Group Update'
	
}

export const chartBoards = {
	decentralization: 'Decentralization',
	donut_shop: 'Donut Shop',
	utxo_allocation: 'UTxO Allocation',
	// stake_flow: "Stake Flow"
	
}



// https://api.github.com/repos/user/repo/contents/data/projects.json
export const postsDataUrl = `${api}/repos/${owner}/${repo}/contents/data/posts.json?ref=${branch}`

// https://api.github.com/repos/user/repo/contents/projects
export const postsUrl = `${api}/repos/${owner}/${repo}/contents/${path}`

// https://github.com/user/repo/blob/main/projects
export const fileUrl = `https://github.com/${owner}/${repo}/blob/${branch}/posts`

// https://raw.githubusercontent.com/user/repo/main/projects/post-slug/images/image.web
export const imagesUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/posts`

