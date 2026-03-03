import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            nav: {
                events: 'Events',
                choirs: 'Choirs',
                gallery: 'Gallery',
                about: 'About',
                login: 'Login'
            },
            hero: {
                welcome: 'Welcome to',
                rukara: 'Rukara Campus',
                subtitle: 'A vibrant religious community dedicated to prayer, worship, and fellowship. Connect with our choirs, stay updated on events, and join us in service.',
                view_events: 'View Events',
                learn_more: 'Learn More'
            },
            features: {
                title: 'Our Community Features',
                events: {
                    title: 'Events & Schedules',
                    desc: 'Stay informed about upcoming prayer meetings, worship nights, and special campus events.'
                },
                choirs: {
                    title: 'Talented Choirs',
                    desc: 'Meet our diverse choirs and explore their journey through our media galleries.'
                },
                announcements: {
                    title: 'Announcements',
                    desc: 'Receive timely updates and notifications from the leadership and ministry heads.'
                }
            }
        }
    },
    rw: {
        translation: {
            nav: {
                events: 'Ibikorwa',
                choirs: 'Korali',
                gallery: 'Amafoto',
                about: 'Ibitwerekeye',
                login: 'Injira'
            },
            hero: {
                welcome: 'Murakaza neza muri',
                rukara: 'Kaminuza ya Rukara',
                subtitle: 'Umuryango w’abizera urangwa n’isengesho, kuramya, n’ubusabane. Huza na korali zacu, umenye amakuru y’ibikorwa, kandi ufatanye natwe mu murimo.',
                view_events: 'Reba ibikorwa',
                learn_more: 'Soma birambuye'
            },
            features: {
                title: 'Ibyo dukora mu muryango',
                events: {
                    title: 'Ibikorwa & Gahunda',
                    desc: 'Hanya kumenya amakuru y’amateraniro yo gusenga, amajoro yo kuramya, n’ibindi birori byihariye biba kuri kaminuza.'
                },
                choirs: {
                    title: 'Korali zacu',
                    desc: 'Menya korali zacu zitandukanye kandi urebe urugendo rwazo mu mafoto no mu mashusho.'
                },
                announcements: {
                    title: 'Amatangazo',
                    desc: 'Habwa amakuru n’amatangazo agezweho avuye mu buyobozi no mu bashinzwe minisiteri.'
                }
            }
        }
    },
    fr: {
        translation: {
            nav: {
                events: 'Événements',
                choirs: 'Chorales',
                gallery: 'Galerie',
                about: 'À propos',
                login: 'Connexion'
            },
            hero: {
                welcome: 'Bienvenue à',
                rukara: 'Campus de Rukara',
                subtitle: 'Une communauté religieuse vibrante dédiée à la prière, à l’adoration et à la fraternité. Connectez-vous avec nos chorales, restez informé des événements et rejoignez-nous dans le service.',
                view_events: 'Voir les événements',
                learn_more: 'En savoir plus'
            },
            features: {
                title: 'Nos Caractéristiques',
                events: {
                    title: 'Événements & Horaires',
                    desc: 'Restez informé des prochaines réunions de prière, des nuits d’adoration et des événements spéciaux du campus.'
                },
                choirs: {
                    title: 'Chorales Talentueuses',
                    desc: 'Rencontrez nos diverses chorales et explorez leur parcours à travers nos galeries médias.'
                },
                announcements: {
                    title: 'Annonces',
                    desc: 'Recevez des mises à jour opportunes et des notifications de la part des dirigeants et des chefs de ministère.'
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
