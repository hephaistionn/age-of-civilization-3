const codeCountry = 'fr';

const locales = {
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
        'Repository': 'EntrepÔt',
        'StoneMine': 'Mine',
        'dirtRoad': 'Chemin de terre',
        'stoneRoad': 'Chemin de pierre',
        'Destroy': 'Détruire',
        'Resources': 'Resources',
        'Society': 'Société'
    }
};

module.exports = function wording(code) {
    return locales[codeCountry][code]||code
};