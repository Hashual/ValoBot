const trn = require('trn.gg');

const API = new trn.TrackerAPI();

async function GetLastSeasionStatistic(username) {

	const userData = await API.profile.getRaw(username);
	if (!userData) { return null; }

	console.log(userData);
	const seasons = userData?.segments?.filter( s => s.type === 'season') ?? [];
	return seasons[0] ?? null;

}

function GetPlayerData(username) {
	return API.profile.getUser(username);
}

module.exports = {
	GetLastSeasionStatistic,
	GetPlayerData,	
}
