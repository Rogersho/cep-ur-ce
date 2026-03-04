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
                subtitle: 'The University of Rwanda - College of Education (UR-CE) Rukara Campus is a center of excellence dedicated to training highly skilled, innovative, and responsible educators for a better society.',
                view_events: 'View Events',
                learn_more: 'Learn More'
            },
            features: {
                title: 'Our Institution',
                events: {
                    title: 'Mission',
                    desc: 'To train and produce knowledgeable, skilled, and innovative educators to meet the needs of Rwandan society and the global community.'
                },
                choirs: {
                    title: 'Vision',
                    desc: 'To be an international center of excellence for education professional training and research.'
                },
                announcements: {
                    title: 'Values',
                    desc: 'We value Commitment, Equity, Partnership, Transparency, Innovation, and Lifelong Learning.'
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
                subtitle: 'Kaminuza y’u Rwanda - Ishuri Nderabarezi (UR-CE), ishami rya Rukara ni ihuriro ry’ubumenyi n’uburezi bugamije gutegura abarimu b’abanyamwuga bafite ubumenyi n’indangagaciro.',
                view_events: 'Reba ibikorwa',
                learn_more: 'Soma birambuye'
            },
            features: {
                title: 'Ibyo dukora',
                events: {
                    title: 'Inshingano',
                    desc: 'Gutegura no gutanga abarimu bafite ubumenyi n’ubushobozi bwo guhangana n’ibibazo by’isi n’iby’u Rwanda muri rusange.'
                },
                choirs: {
                    title: 'Icyerekezo',
                    desc: 'Kuba ihuriro mpuzamahanga ry’icyitegererezo mu burezi, ubushakashatsi, n’amahugurwa y’abanyamwuga mu burezi.'
                },
                announcements: {
                    title: 'Indangagaciro',
                    desc: 'Twubakiye ku Kwiyemeza, Uburinganire, Ubufatanye, Mucyo, no Guhanga Udushya mu burezi.'
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
                subtitle: 'L’Université du Rwanda - Collège de l’Éducation (UR-CE) Campus de Rukara est un centre d’excellence dédié à la formation d’éducateurs hautement qualifiés, innovants et responsables pour une société meilleure.',
                view_events: 'Voir les événements',
                learn_more: 'En savoir plus'
            },
            features: {
                title: 'Notre Institution',
                events: {
                    title: 'Mission',
                    desc: 'Former et produire des éducateurs compétents et innovants pour répondre aux besoins de la société rwandaise et de la communauté mondiale.'
                },
                choirs: {
                    title: 'Vision',
                    desc: 'Être un centre d’excellence international pour la formation professionnelle en éducation et la recherche.'
                },
                announcements: {
                    title: 'Valeurs',
                    desc: 'Nous valorisons l’engagement, l’équité, le partenariat, la transparence, l’innovation et l’apprentissage tout au long de la vie.'
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
