const codeCountry = 'fr';

locales = {
    fr: {
        wood: 'wood',
        stone: 'stone',
        meat: 'meat',
        population: 'population',
        'House': 'Hutte',
        'Market': 'Marché',
        'WoodCutterHut': 'Cabane de bucheron',
        'Attic': 'Grenier',
        'Barrack': 'Caserne',
        'HunterHut': 'Cabane de chasseur',
        'LeaderHut': 'Hutte du chef',
        'Repository': 'Entrepôt',
        'StoneMine': 'Mine',
        'dirtRoad': 'Chemin de terre',
        'stoneRoad': 'Chemin de pierre',
        'Destroy': 'Détruire'
    }
};

module.exports = function wording(code) {
    return locales[codeCountry][code]
};