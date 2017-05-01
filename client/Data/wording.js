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
        'Society': 'Société',
        'need': 'Il manque @1 en ',
        'cityName': 'nom de la cité : @1',
        'cityLevel': 'niveau de la cité : @1'
    }
};

module.exports = function wording(code) {
    return locales[codeCountry][code]||code
};