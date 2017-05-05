module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "env": {
        "browser": true,
        "es6": true,
        "amd": true
    }, 
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    }, 
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};