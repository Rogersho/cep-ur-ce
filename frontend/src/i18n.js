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
                news: 'News',
                about: 'About',
                committee: 'Committee',
                login: 'Login',
                my_uploads: 'My Uploads'
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
            },
            events: {
                title: 'Upcoming',
                span: 'Events',
                subtitle: 'Join us in our upcoming activities and community gatherings.',
                no_events: 'No upcoming events scheduled at the moment.',
                loading: 'Loading events...',
                error: 'Error loading events. Check if backend is running.',
                share_image: 'Download as Image',
                share_links: 'Share Links',
                generating: 'Generating your event card...',
                downloaded: 'Event card downloaded!',
                failed: 'Failed to generate image. Try again.',
                copied: 'Event details copied to clipboard!'
            },
            gallery: {
                title: 'Community',
                span: 'Gallery',
                subtitle: 'Explore beautiful moments from our worship gatherings, choir performances, and community activities.',
                no_photos: 'No photos have been uploaded to the gallery yet.',
                loading: 'Loading gallery...'
            },
            choirs: {
                title: 'Our',
                span: 'Choirs',
                no_choirs: 'No choirs registered yet.',
                loading: 'Loading choirs...',
                error: 'Error loading choirs.',
                leader: 'Leader',
                view_gallery: 'View Gallery'
            },
            about: {
                loading: 'Loading about us...',
                subtitle: 'Discover our story, mission, and the community that makes CEP UR-CE special.',
                no_content: 'No content has been added yet.'
            },
            committee: {
                title: 'Our',
                span: 'Committee',
                subtitle: 'The dedicated leadership team serving the CEP UR-CE community.',
                loading: 'Loading committee members...',
                no_members: 'No committee members found.',
                year_select: 'Filter by Academic Year'
            },
            announcements: {
                title: 'Latest',
                span: 'Announcements',
                no_announcements: 'No announcements at this time.',
                loading: 'Loading announcements...'
            },
            admin: {
                title: 'CEP ADMIN',
                nav: {
                    overview: 'Overview',
                    events: 'Manage Events',
                    choirs: 'Manage Choirs',
                    gallery: 'Manage Gallery',
                    news: 'Manage News',
                    about: 'Manage About',
                    committee: 'Manage Committee',
                    return: 'Return to Site',
                    logout: 'Logout'
                },
                common: {
                    add: 'Add New',
                    cancel: 'Cancel',
                    edit: 'Edit',
                    delete: 'Delete',
                    save: 'Save',
                    update: 'Update',
                    actions: 'Actions',
                    loading: 'Loading...',
                    no_data: 'No data found.',
                    confirm_delete: 'Are you sure you want to delete this item?'
                },
                dashboard: {
                    overview: 'Overview',
                    stats_subtitle: 'Monitor and manage the CEP UR-CE platform content.',
                    total_events: 'Total Events',
                    active_choirs: 'Active Choirs',
                    gallery_items: 'Gallery Items',
                    announcements: 'Announcements',
                    activity: 'Platform Activity',
                    no_activity: 'No recent activity records found.',
                    created: 'Created',
                    updating: 'Updating platform statistics...',
                    total_users: 'Total Users'
                },
                gallery_pills: {
                    all: 'All moments',
                    album: '(Album)',
                    choir: '(Choir)'
                },
                events: {
                    title: 'Manage Events',
                    add_btn: 'Add New Event',
                    edit_title: 'Edit Event',
                    new_title: 'New Event Details',
                    field_title: 'Event Title',
                    field_date: 'Date & Time',
                    field_location: 'Location',
                    field_desc: 'Description',
                    field_image: 'Thumbnail Image',
                    success_create: 'Event created successfully!',
                    success_update: 'Event updated successfully!',
                    success_delete: 'Event deleted successfully!',
                    error_create: 'Error creating event',
                    error_update: 'Error updating event',
                    error_delete: 'Error deleting event'
                },
                choirs: {
                    title: 'Manage Choirs',
                    add_btn: 'New Choir',
                    edit_title: 'Edit Choir Group',
                    new_title: 'New Choir Details',
                    field_name: 'Choir Name',
                    field_leader: 'Leader Name',
                    field_desc: 'Description',
                    field_thumbnail: 'Thumbnail (Optional)',
                    success_create: 'Choir group added successfully!',
                    success_update: 'Choir group updated successfully!',
                    success_delete: 'Choir group deleted successfully!',
                    error_create: 'Error adding choir',
                    error_update: 'Error updating choir',
                    error_delete: 'Error deleting choir'
                },
                news: {
                    title: 'Manage Announcements',
                    add_btn: 'New Announcement',
                    edit_title: 'Edit Announcement',
                    new_title: 'Announcement Details',
                    field_title: 'Title',
                    field_content: 'Content',
                    field_priority: 'Priority',
                    priority_normal: 'Normal',
                    priority_high: 'High',
                    success_create: 'Announcement published!',
                    success_update: 'Announcement updated!',
                    success_delete: 'Announcement removed!',
                    error_create: 'Error publishing announcement',
                    error_update: 'Error updating announcement',
                    error_delete: 'Error removing announcement'
                },
                about: {
                    title: 'Manage About Us',
                    add_btn: 'Add Section',
                    edit_title: 'Edit Section',
                    new_title: 'New About Section',
                    field_title_en: 'Title (English)',
                    field_title_rw: 'Title (Kinyarwanda)',
                    field_title_fr: 'Title (French)',
                    field_content_en: 'Content (English)',
                    field_content_rw: 'Content (Kinyarwanda)',
                    field_content_fr: 'Content (French)',
                    field_image: 'Illustration Image',
                    field_order: 'Display Order (lower is first)',
                    success_create: 'Section added successfully!',
                    success_update: 'Section updated successfully!',
                    success_delete: 'Section deleted successfully!'
                },
                committee: {
                    title: 'Manage Committee',
                    add_btn: 'Add Member',
                    edit_title: 'Edit Member',
                    new_title: 'New Member Details',
                    field_name: 'Full Name',
                    field_position: 'Position',
                    field_year: 'Year Range (e.g. 2024-2025)',
                    field_phone: 'Phone Number',
                    field_email: 'Email Address',
                    field_bio: 'Short Bio',
                    field_image: 'Member Photo',
                    success_create: 'Member added successfully!',
                    success_update: 'Member updated successfully!',
                    success_delete: 'Member deleted successfully!'
                },
                gallery: {
                    title: 'Manage Gallery',
                    add_btn: 'Upload Photo',
                    edit_title: 'Edit Photo Details',
                    new_title: 'Photo Details',
                    field_caption: 'Caption',
                    field_file: 'Select Image File',
                    success_create: 'Photo uploaded!',
                    success_update: 'Photo updated!',
                    success_delete: 'Photo deleted!',
                    error_create: 'Error uploading photo',
                    error_update: 'Error updating photo',
                    error_delete: 'Error deleting photo'
                },
                permissions: {
                    title: 'Permissions',
                    grant: 'Grant',
                    revoke: 'Revoke',
                    authorized_users: 'Currently Authorized Users'
                }
            },
            my_uploads: {
                title: 'My',
                span: 'Uploads',
                subtitle: 'Manage items you are authorized to upload to the community gallery.',
                no_items: 'No items uploaded by you yet.',
                authorized_albums: 'Authorized Albums',
                authorized_choirs: 'Authorized Choirs',
                upload_btn: 'Upload Item'
            }
        }
    },
    rw: {
        translation: {
            nav: {
                events: 'Ibikorwa',
                choirs: 'Korali',
                gallery: 'Amafoto',
                news: 'Amakuru',
                about: 'Ibitwerekeye',
                login: 'Injira',
                my_uploads: 'Ibyo nashyizeho'
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
            },
            events: {
                title: 'Ibiteganyijwe',
                span: 'Ibikorwa',
                subtitle: 'Fatanya natwe mu bikorwa byacu n’amateraniro y’umuryango wacu.',
                no_events: 'Nta bikorwa biteganyijwe muri aka kanya.',
                loading: 'Itegerezwa...',
                error: 'Ikibazo cyavunze mu gushaka ibikorwa.',
                share_image: 'Kuramo nk\'ifoto',
                share_links: 'Sangiza abandi',
                generating: 'Turi gutegura ifoto...',
                downloaded: 'Ifoto yakuwe mo!',
                failed: 'Gukora ifoto byanze. Ongera ugerageze.',
                copied: 'Amakuru yakuwe mo!'
            },
            gallery: {
                title: 'Amafoto',
                span: 'y\'Umuryango',
                subtitle: 'Reba ibihe byiza by\'amasengesho yacu, ibitaramo bya korali n\'ibindi bikorwa.',
                no_photos: 'Nta mafoto arashyirwa hano.',
                loading: 'Itegerezwa...'
            },
            choirs: {
                title: 'Korali',
                span: 'Zacu',
                no_choirs: 'Nta korali zirandikwa hano.',
                loading: 'Itegerezwa...',
                error: 'Ikibazo mu gushaka korali.',
                leader: 'Umuyobozi',
                view_gallery: 'Reba amafoto'
            },
            about: {
                loading: 'Itegerezwa...',
                subtitle: 'Menya amateka yacu, inshingano, n’umuryango ugize CEP UR-CE.',
                no_content: 'Nta makuru arashyirwa hano.'
            },
            announcements: {
                title: 'Amakuru',
                span: 'Agezweho',
                no_announcements: 'Nta makuru ahari muri aka kanya.',
                loading: 'Itegerezwa...'
            },
            admin: {
                title: 'CEP ADMIN',
                nav: {
                    overview: 'Incamake',
                    events: 'Gucunga ibikorwa',
                    choirs: 'Gucunga korali',
                    gallery: 'Gucunga amafoto',
                    news: 'Gucunga amakuru',
                    about: 'Gucunga Ibitwerekeye',
                    return: 'Subira ku rubuga',
                    logout: 'Sohoka'
                },
                common: {
                    add: 'Ongeraho',
                    cancel: 'Reka',
                    edit: 'Hindura',
                    delete: 'Siba',
                    save: 'Bika',
                    update: 'Vugurura',
                    actions: 'Ibyo wakora',
                    loading: 'Itegerezwa...',
                    no_data: 'Nta makuru ahari.',
                    confirm_delete: 'Urashaka gusiba iki kintu koko?'
                },
                dashboard: {
                    overview: 'Incamake',
                    stats_subtitle: 'Genzi kandi ucunge ibiri ku rubuga rwa CEP UR-CE.',
                    total_events: 'Ibikorwa byose',
                    active_choirs: 'Korali zihari',
                    gallery_items: 'Ibyo mu mafoto',
                    announcements: 'Amakuru',
                    activity: 'Iheruka gukorwa',
                    no_activity: 'Nta gikorwa giheruka kuboneka.',
                    created: 'Byashyizweho',
                    updating: 'Gushaka imibare...',
                    total_users: 'Abakoresha bose'
                },
                gallery_pills: {
                    all: 'Ibihe byose',
                    album: '(Albamu)',
                    choir: '(Korali)'
                },
                events: {
                    title: 'Gucunga Ibikorwa',
                    add_btn: 'Ongeraho Igikorwa',
                    edit_title: 'Hindura Igikorwa',
                    new_title: 'Amakuru y\'Igikorwa Gishya',
                    field_title: 'Izina ry\'Igikorwa',
                    field_date: 'Itariki n\'Isaha',
                    field_location: 'Ahantu',
                    field_desc: 'Ibisobanuro',
                    field_image: 'Ifoto',
                    success_create: 'Igikorwa cyashyizweho neza!',
                    success_update: 'Igikorwa cyavuguruwe neza!',
                    success_delete: 'Igikorwa cyasibwe neza!',
                    error_create: 'Ikibazo mu gushyiraho igikorwa',
                    error_update: 'Ikibazo mu kuvugurura igikorwa',
                    error_delete: 'Ikibazo mu gusiba igikorwa'
                },
                choirs: {
                    title: 'Gucunga Korali',
                    add_btn: 'Ongeraho Korali',
                    edit_title: 'Hindura Korali',
                    new_title: 'Amakuru ya Korali nshya',
                    field_name: 'Izina rya Korali',
                    field_leader: 'Izina ry\'Umuyobozi',
                    field_desc: 'Ibisobanuro',
                    field_thumbnail: 'Ifoto',
                    success_create: 'Korali yashyizweho neza!',
                    success_update: 'Korali yavuguruwe neza!',
                    success_delete: 'Korali yasibwe neza!',
                    error_create: 'Ikibazo mu gushyiraho korali',
                    error_update: 'Ikibazo mu kuvugurura korali',
                    error_delete: 'Ikibazo mu gusiba korali'
                },
                news: {
                    title: 'Gucunga Amakuru',
                    add_btn: 'Ongeraho amakuru',
                    edit_title: 'Hindura Amakuru',
                    new_title: 'Amakuru mashya',
                    field_title: 'Umutwe',
                    field_content: 'Ibirimo',
                    field_priority: 'Urwego',
                    priority_normal: 'Bisanzwe',
                    priority_high: 'Icyihutirwa',
                    success_create: 'Amakuru yashyizweho!',
                    success_update: 'Amakuru yavuguruwe!',
                    success_delete: 'Amakuru yasibwe!',
                    error_create: 'Ikibazo mu gushyiraho amakuru',
                    error_update: 'Ikibazo mu kuvugurura amakuru',
                    error_delete: 'Ikibazo mu gusiba amakuru'
                },
                about: {
                    title: 'Gucunga Ibitwerekeye',
                    add_btn: 'Ongeraho igice',
                    edit_title: 'Hindura igice',
                    new_title: 'Igice gishya',
                    field_title_en: 'Umutwe (Icyongereza)',
                    field_title_rw: 'Umutwe (Ikinyarwanda)',
                    field_title_fr: 'Umutwe (Igifaransa)',
                    field_content_en: 'Ibirimo (Icyongereza)',
                    field_content_rw: 'Ibirimo (Ikinyarwanda)',
                    field_content_fr: 'Ibirimo (Igifaransa)',
                    field_image: 'Ifoto',
                    field_order: 'Urutonde',
                    success_create: 'Byashyizweho neza!',
                    success_update: 'Byavuguruwe neza!',
                    success_delete: 'Byasibwe neza!'
                },
                gallery: {
                    title: 'Gucunga Amafoto',
                    add_btn: 'Shyiraho Ifoto',
                    edit_title: 'Hindura Ifoto',
                    new_title: 'Amakuru y\'Ifoto',
                    field_caption: 'Ibisobanuro',
                    field_file: 'Hitamo Ifoto',
                    success_create: 'Ifoto yashyizweho!',
                    success_update: 'Ifoto yavuguruwe!',
                    success_delete: 'Ifoto yasibwe!',
                    error_create: 'Ikibazo mu gushyiraho ifoto',
                    error_update: 'Ikibazo mu kuvugurura ifoto',
                    error_delete: 'Ikibazo mu gusiba ifoto'
                },
                permissions: {
                    title: 'Uburenganzira',
                    grant: 'Tanga',
                    revoke: 'Kuraho',
                    authorized_users: 'Abafite uburenganzira'
                }
            },
            my_uploads: {
                title: 'Ibyo',
                span: 'Nashyizeho',
                subtitle: 'Genzura amapoto n\'amashusho wemerewe gushyira hano.',
                no_items: 'Nta kintu urashyiraho.',
                authorized_albums: 'Albamu wemerewe',
                authorized_choirs: 'Korali wemerewe',
                upload_btn: 'Shyiraho ikintu'
            }
        }
    },
    fr: {
        translation: {
            nav: {
                events: 'Événements',
                choirs: 'Chorales',
                gallery: 'Galerie',
                news: 'Actualités',
                about: 'À propos',
                login: 'Connexion',
                my_uploads: 'Mes Téléchargements'
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
                    desc: 'Formation d’éducateurs compétents et innovants pour répondre aux besoins de la société rwandaise.'
                },
                choirs: {
                    title: 'Vision',
                    desc: 'Être un centre d’excellence international pour la formation professionnelle en éducation.'
                },
                announcements: {
                    title: 'Valeurs',
                    desc: 'Engagement, Équité, Partenariat, Transparence, Innovation.'
                }
            },
            events: {
                title: 'À venir',
                span: 'Événements',
                subtitle: 'Rejoignez-nous dans nos prochaines activités et rassemblements communautaires.',
                no_events: 'Aucun événement prévu pour le moment.',
                loading: 'Chargement...',
                error: 'Erreur lors du chargement des événements.',
                share_image: 'Télécharger comme image',
                share_links: 'Partager le lien',
                generating: 'Génération de votre carte...',
                downloaded: 'Carte téléchargée!',
                failed: 'Échec de la génération de l\'image.',
                copied: 'Détails copiés!'
            },
            gallery: {
                title: 'Galerie',
                span: 'Communautaire',
                subtitle: 'Découvrez de beaux moments de nos rassemblements de culte et activités.',
                no_photos: 'Aucune photo dans la galerie.',
                loading: 'Chargement...'
            },
            choirs: {
                title: 'Nos',
                span: 'Chorales',
                no_choirs: 'Aucune chorale enregistrée.',
                loading: 'Chargement...',
                error: 'Erreur lors du chargement des chorales.',
                leader: 'Leader',
                view_gallery: 'Voir la galerie'
            },
            about: {
                loading: 'Chargement...',
                subtitle: 'Découvrez notre histoire, notre mission et la communauté de la CEP UR-CE.',
                no_content: 'Aucun contenu n\'a encore été ajouté.'
            },
            announcements: {
                title: 'Dernières',
                span: 'Annonces',
                no_announcements: 'Aucune annonce pour le moment.',
                loading: 'Chargement...'
            },
            admin: {
                title: 'CEP ADMIN',
                nav: {
                    overview: 'Aperçu',
                    events: 'Gérer les événements',
                    choirs: 'Gérer les chorales',
                    gallery: 'Gérer la galerie',
                    news: 'Gérer les actualités',
                    about: 'Gérer À propos',
                    return: 'Retour au site',
                    logout: 'Déconnexion'
                },
                common: {
                    add: 'Ajouter',
                    cancel: 'Annuler',
                    edit: 'Modifier',
                    delete: 'Supprimer',
                    save: 'Enregistrer',
                    update: 'Mettre à jour',
                    actions: 'Actions',
                    loading: 'Chargement...',
                    no_data: 'Aucune donnée trouvée.',
                    confirm_delete: 'Êtes-vous sûr de vouloir supprimer cet élément?'
                },
                dashboard: {
                    overview: 'Aperçu',
                    stats_subtitle: 'Surveillez et gérez le contenu de la plateforme CEP UR-CE.',
                    total_events: 'Total des événements',
                    active_choirs: 'Chorales actives',
                    gallery_items: 'Éléments de la galerie',
                    announcements: 'Annonces',
                    activity: 'Activité de la plateforme',
                    no_activity: 'Aucun enregistrement d\'activité récente trouvé.',
                    created: 'Créé',
                    updating: 'Mise à jour des statistiques...',
                    total_users: 'Total des utilisateurs'
                },
                gallery_pills: {
                    all: 'Tous les moments',
                    album: '(Album)',
                    choir: '(Chorale)'
                },
                events: {
                    title: 'Gérer les événements',
                    add_btn: 'Ajouter un événement',
                    edit_title: 'Modifier l\'événement',
                    new_title: 'Nouvel événement',
                    field_title: 'Titre de l\'événement',
                    field_date: 'Date et heure',
                    field_location: 'Emplacement',
                    field_desc: 'Description',
                    field_image: 'Image',
                    success_create: 'Événement créé avec succès !',
                    success_update: 'Événement mis à jour avec succès !',
                    success_delete: 'Événement supprimé avec succès !',
                    error_create: 'Erreur lors de la création de l\'événement',
                    error_update: 'Erreur lors de la mise à jour de l\'événement',
                    error_delete: 'Erreur lors de la suppression de l\'événement'
                },
                choirs: {
                    title: 'Gérer les chorales',
                    add_btn: 'Nouvelle chorale',
                    edit_title: 'Modifier le groupe de chorale',
                    new_title: 'Détails de la nouvelle chorale',
                    field_name: 'Nom de la chorale',
                    field_leader: 'Nom du leader',
                    field_desc: 'Description',
                    field_thumbnail: 'Vignette (optionnelle)',
                    success_create: 'Groupe de chorale ajouté avec succès !',
                    success_update: 'Groupe de chorale mis à jour avec succès !',
                    success_delete: 'Groupe de chorale supprimé avec succès !',
                    error_create: 'Erreur lors de l\'ajout de la chorale',
                    error_update: 'Erreur lors de la mise à jour de la chorale',
                    error_delete: 'Erreur lors de la suppression de la chorale'
                },
                news: {
                    title: 'Gérer les annonces',
                    add_btn: 'Nouvelle annonce',
                    edit_title: 'Modifier l\'annonce',
                    new_title: 'Détails de l\'annonce',
                    field_title: 'Titre',
                    field_content: 'Contenu',
                    field_priority: 'Priorité',
                    priority_normal: 'Normale',
                    priority_high: 'Haute',
                    success_create: 'Annonce publiée !',
                    success_update: 'Annonce mise à jour !',
                    success_delete: 'Annonce supprimée !',
                    error_create: 'Erreur lors de la publication',
                    error_update: 'Erreur lors de la mise à jour',
                    error_delete: 'Erreur lors de la suppression'
                },
                about: {
                    title: 'Gérer À propos de nous',
                    add_btn: 'Ajouter une section',
                    edit_title: 'Modifier la section',
                    new_title: 'Nouvelle section À propos',
                    field_title_en: 'Titre (Anglais)',
                    field_title_rw: 'Titre (Kinyarwanda)',
                    field_title_fr: 'Titre (Français)',
                    field_content_en: 'Contenu (Anglais)',
                    field_content_rw: 'Contenu (Kinyarwanda)',
                    field_content_fr: 'Contenu (Français)',
                    field_image: 'Image d\'illustration',
                    field_order: 'Ordre d\'affichage',
                    success_create: 'Section ajoutée avec succès !',
                    success_update: 'Section mise à jour avec succès !',
                    success_delete: 'Section supprimée avec succès !'
                },
                gallery: {
                    title: 'Gérer la galerie',
                    add_btn: 'Télécharger une photo',
                    edit_title: 'Modifier la photo',
                    new_title: 'Détails de la photo',
                    field_caption: 'Légende',
                    field_file: 'Fichier image',
                    success_create: 'Photo mise en ligne !',
                    success_update: 'Photo mise à jour !',
                    success_delete: 'Photo supprimée !',
                    error_create: 'Erreur de mise en ligne',
                    error_update: 'Erreur de mise à jour',
                    error_delete: 'Erreur de suppression'
                },
                permissions: {
                    title: 'Autorisations',
                    grant: 'Accorder',
                    revoke: 'Révoquer',
                    authorized_users: 'Utilisateurs autorisés'
                }
            },
            my_uploads: {
                title: 'Mes',
                span: 'Téléchargements',
                subtitle: 'Gérez les éléments que vous êtes autorisé à mettre en ligne.',
                no_items: 'Aucun élément téléchargé par vous.',
                authorized_albums: 'Albums autorisés',
                authorized_choirs: 'Chorales autorisées',
                upload_btn: 'Télécharger'
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
