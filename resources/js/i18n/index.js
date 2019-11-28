// Vue-i18n
import Vue from 'vue';
import VueInternationalization from 'vue-i18n';
import {extend} from 'ROOT/utilities';

VueInternationalization.prototype.getChoiceIndex = (choice, choicesLength) => {
    if (this.locale !== 'ru') {
        var defaultImpl = function (_choice, _choicesLength) {
            _choice = Math.abs(_choice);

            if (_choicesLength === 2) {
                return _choice
                    ? _choice > 1
                        ? 1
                        : 0
                    : 1
            }

            return _choice ? Math.min(_choice, 2) : 0
        };

        if (this.locale in this.pluralizationRules) {
            return this.pluralizationRules[this.locale].apply(this, [choice, choicesLength])
        } else {
            return defaultImpl(choice, choicesLength)
        }
    }

    if (choice === 0) {
        return 0;
    }

    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (!teen && endsWithOne) {
        return 1;
    }

    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
    }

    return (choicesLength < 4) ? 2 : 3;
};

Vue.use(VueInternationalization);

// let extendObject = Locale;
let modules = require.context('./../store/modules/', true, /\.locale.js/i);
let extendObject;

modules.keys().map((key) => {
    extendObject = extend(true, extendObject, modules(key).default);
});

let localization = require.context('./../../lang/', true, /\.js/i);
localization.keys().map((key) => {
    let lang = key.split('/')[1];
    let obj = {};

    obj[lang] = localization(key).default;

    extendObject = extend(true, extendObject, obj);
});

console.log(extendObject);

const lang = document.documentElement.lang.substr(0, 2);

export const i18n = new VueInternationalization({
    locale: lang,
    messages: extendObject
});