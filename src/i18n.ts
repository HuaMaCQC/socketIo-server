import * as i18n from 'i18n';
i18n.configure({
    locales: ['zh-tw'],
    directory: __dirname + '/locales',
    defaultLocale: 'zh-tw',
});
console.log(i18n.__('hello'));