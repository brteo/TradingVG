import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import 'moment/locale/it';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: process.env.NODE_ENV === 'development',
		whitelist: ['en', 'it'],
		defaultNS: 'common',
		ns: ['common', 'core']
	});

i18n.on('languageChanged', lng => moment.locale(lng));

export default i18n;
