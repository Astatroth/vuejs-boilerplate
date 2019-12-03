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
// let modules = require.context('./../store/modules/', true, /\.locale.js/i);
let extendObject;

/*modules.keys().map((key) => {
    extendObject = extend(true, extendObject, modules(key).default);
});*/

let localization = require.context('./../../lang/', true, /\.js/i);
localization.keys().map((key) => {
    let lang = key.split('/')[1];
    let obj = {};

    obj[lang] = localization(key).default;

    extendObject = extend(true, extendObject, obj);
});

const lang = document.documentElement.lang;

export const i18n = new VueInternationalization({
    locale: lang,
    messages: extendObject
});

const loadedLanguages = [];

function setI18nLanguage(lang) {
    i18n.locale = lang;
    axios.defaults.headers.common['Accept-Language'] = lang;
    document.querySelector('html').setAttribute('lang', lang);

    return lang;
}

export function loadLanguageAsync(module) {
    if (loadedLanguages.includes(module)) {
        return;
    }

    return import(/* webpackChunkName: "lang-[request]" */ `../store/modules/${module}/lang.js`).then((messages) => {
        let _messages = i18n.messages;
        let extendObject = {};

        Object.keys(_messages).map((key) => {
            let obj = {};
            let locale = messages.default[key];

            obj[key] = _messages[key];
            extendObject = extend(true, obj[key], locale);

            i18n.setLocaleMessage(key, extendObject);
        });

        console.log(i18n.messages);
        loadedLanguages.push(module);
    });
}