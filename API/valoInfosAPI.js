const apiURL = 'https://valorant-api.com'

async function getAgents() {
    const reponse = await fetch(`${apiURL}/v1/agents?language=fr-FR&isPlayableCharacter=true`)
    const data = await reponse.json()
    return data.data
}

async function getCompetences() {
    const reponse = await fetch(`${apiURL}/v1/agents?language=fr-FR&isPlayableCharacter=true`)
    const data = await reponse.json()
    return data.data
}

async function getArmes() {
    const reponse = await fetch(`${apiURL}/v1/weapons?language=fr-FR`)
    const data = await reponse.json()
    return data.data
}



module.exports ={
    getAgents,
    getCompetences,
    getArmes,
}

