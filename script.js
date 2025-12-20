document.addEventListener('DOMContentLoaded', () => {

    // --- Text Reveal Animation ---
    const revealText = (elements) => {
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            const lines = text.split(/\r?\n/);
            let charIndex = 0;
            lines.forEach((line, lineIdx) => {
                if (lineIdx > 0) el.appendChild(document.createElement('br'));
                line.split('').forEach((char) => {
                    const span = document.createElement('span');
                    span.innerText = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = `${charIndex * 0.03}s`;
                    el.appendChild(span);
                    charIndex++;
                });
            });
            el.classList.add('char-reveal');
        });
    };

    // Animate H1 on load
    revealText(document.querySelectorAll('h1'));

    // --- Cursor Logic (Lerp for smooth lag) ---
    const cursor = document.getElementById('cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15; // Smooth factor
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover & Click states
    document.querySelectorAll('a, button, .project-row, .veille-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // Nav Click Immediate Feedback
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    // --- Scroll Animations & Nav Spy ---
    const spySections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        rootMargin: '-40% 0px -40% 0px' // Active when section is in the middle 20% of screen
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to section for animations
                entry.target.classList.add('active');

                // Nav Spy Logic
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href').includes('#' + id)) {
                            link.classList.add('active');
                        } else {
                            // Protect current page link from being deactivated by scroll spy
                            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                            const linkHref = link.getAttribute('href');

                            // If the link points to the current page (e.g. about.html), keep it active
                            if (linkHref === currentPage) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        }
                    });
                }
            }
        });
    }, observerOptions);

    spySections.forEach(el => {
        observer.observe(el);
    });

    // --- Language Toggle ---
    const i18n = {
        fr: {
            nav_story: "Parcours",
            nav_work: "Projets",
            nav_contact: "Contact",
            theme_label: "Thème",
            hero_lead: "Étudiant en informatique, je navigue à l'intersection de la data, du design et des réseaux. Mon portfolio présente des projets où la rigueur analytique rencontre la clarté visuelle et la résilience structurelle. Je construis des ponts entre les chiffres, l'esthétique et la connectivité.",
            stat_projects: "Projets",
            stat_exp: "Ans d'expérience",
            stat_stacks: "Stacks",
            sect_selection: "Sélection",
            sect_history: "Expériences",
            timeline_date_1: "2024 - Aujourd'hui",
            timeline_title_1: "BUT Métiers du Multimédia et de l'Internet",
            timeline_desc_1: "Major de promotion 2024 - 2025",
            timeline_date_2: "ÉTÉ 2025",
            timeline_title_2: "Junior Data Engineer",
            timeline_desc_2: "Stage - La Banque Postale",
            timeline_date_3: "2020 - 2023",
            timeline_title_3: "Lycée André Boulloche",
            timeline_desc_3: "Baccalauréat Spécialité Mathématiques et Anglais Mention Bien",
            sect_skills: "Compétences",
            skills_lead: "Un équilibre entre mes fondations en MMI et les compétences techniques que je développe pour ma transition professionnelle.",
            skills_sub_mmi: "Fondations MMI",
            skills_desc_mmi: "Compétences solides acquises durant mon parcours MMI.",
            skills_sub_evo: "Compétences en évolution",
            skills_desc_evo: "Technologies pour ma transition Cyber & Data.",
            sect_watch: "Veille",
            contact_ready: "Prêt à collaborer ?",
            footer_lang: "Switch to English",
            footer_cv: "Télécharger CV",

            // Generic & Meta
            label_role: "Rôle",
            label_year: "Année",
            label_tools: "Outils",
            scroll_explore: "DÉFILER POUR EXPLORER",
            nav_next_edition: "ÉDITION SUIVANTE →",
            nav_prev_edition: "← ÉDITION PRÉCÉDENTE",
            nav_all_editions: "TOUTES LES ÉDITIONS",

            // Mag Neon Specifics
            role_neon: "Directeur Artistique",

            // Mag Selection
            mag_select_title: "Projets",
            mag_select_lead: "Trois esthétiques. Trois approches. Choisir une édition.",

            // Works Page
            works_page_title: "Réalisations.",
            works_page_lead: "Une vision globale de mes projets : design, data et expériences web.",
            work_cat_design: "Design & Editorial",
            work_cat_data: "Programmation, Data & Intelligence",
            work_cat_web: "Web & Ecosystèmes",

            // Mag Structure
            mag_struct_title: "Structure & Void",
            mag_struct_lead: "Un magazine conceptuel présentant une réinterprétation visuelle de la discographie d'un duo hip-hop légendaire, à travers des mockups depochettes d'albums et de livrets sophistiqués et percutants.",
            // Using generic labels now
            struct_magazine_title: "Le Magazine",
            struct_cover_title: "L'Identité Visuelle",
            struct_cover_text: "La couverture impose le ton avec une typographie massive et un contraste absolu. L'absence de couleur force l'œil à se concentrer sur la structure et la hiérarchie des informations.",
            struct_back_title: "Structure & Tracklist",
            struct_back_text: "Le verso révèle l'ossature du projet. La tracklist n'est pas une simple liste, mais un élément architectural qui supporte la composition globale.",
            struct_vinyl_title: "L'Objet Vinyle",
            struct_vinyl_text: "Une expérience tangible. Le design s'étend au vinyle avec un rappel des codes brutalistes. Le disque lui-même devient une extension de l'architecture graphique.",
            struct_extras_title: "Détails & Immersion",
            struct_extras_text: "L'expérience est complétée par un livret et des éléments imprimés qui explorent les textures et les superpositions. Chaque élément raconte une partie de l'histoire.",

            // Mag Type
            mag_type_title: "Swiss Focus",
            mag_type_lead: "L'ordre, la grille et la lisibilité comme dogmes absolus.",
            type_analysis_title: "Le Style International",
            type_analysis_text: "Hommage aux maîtres suisses. Utilisation exclusive d'une seule famille typographique et d'une grille modulaire stricte pour atteindre une clarté objective.",
            type_grid_title: "Système & Rigueur",
            type_grid_text: "Chaque élément est ancré. L'espace blanc n'est pas vide, il est actif. Il définit la structure autant que le texte lui-même.",

            // Mag Neon
            back_select: "← Retour à la sélection",
            mag_neon_lead: "Un magazine explorant des icones de la culture hip-hop et les pieces qui ont fait de eux des légendes.",
            chaos_title: "Chaos Organisé",
            chaos_text_1: "L'essence du projet réside dans la tension entre rigidité et désordre. J'ai utilisé une grille suisse modulaire de 12 colonnes comme fondation, que j'ai délibérément cassée avec des éléments typographiques hors-cadre et des images en pleine page.",
            chaos_text_2: "Le choix de la typographie s'est porté sur un mélange d'une Grotesque large pour les titres (impact visuel immédiat) et d'une mono-space technique pour les légendes, rappelant le code et les données brutes.",
            immersion_title: "IMMERSION VISUELLE",
            palette_title: "Palette & texture",
            palette_text: "Le noir profond (Rich Black) contraste avec des accents de couleurs néon saturées, atténués par un grain papier numérique qui ajoute de la tactilité à l'écran. Chaque page est pensée comme une affiche individuelle.",
            webgl_title: "L'Expérience WebGL",
            webgl_text: "Pour dépasser le format statique du PDF, j'ai développé une visionneuse interactive. L'utilisateur peut manipuler le magazine en 3D, percevoir l'épaisseur du papier et voir la lumière réagir sur la surface.",
            tech_1: "Three.js pour le rendu physique (PBR)",
            tech_2: "Physique des pages avec Cannon.js",
            tech_3: "Optimisation des textures (KTX2)",
            btn_live: "Voir le site",
            btn_code: "Code Source",

            // Navigation
            mag_nav_title: "Autres Éditions",

            // Contact Page
            contact_title: "Parlons Projet.",
            contact_subtitle: "Intéressé par une collaboration ou juste envie de dire bonjour ? Remplissez ce formulaire et je vous répondrai dès que possible.",
            form_name: "Nom",
            form_email: "Email",
            form_message: "Message",
            form_message: "Message",
            form_submit: "Envoyer",
            form_success_msg: "Message envoyé ! Merci pour votre contact.",
            form_error_msg: "Erreur lors de l'envoi. Veuillez réessayer.",
            form_sent_btn: "✓ Envoyé",

            // --- ALL WEB PROJECTS TRANSLATIONS ---
            // Generic Buttons & Labels
            btn_contact_me: "Me Contacter",
            back_projects: "← Retour aux projets",
            btn_doc: "Voir le site",
            btn_visit: "Visiter",
            btn_github: "Voir sur GitHub",
            lbl_objectives: "Objectifs",
            lbl_stack: "Stack Technique",
            lbl_learning: "Apprentissage",
            lbl_improvements: "Améliorations",
            lbl_source: "Source de Données",
            lbl_context: "Contexte",

            title_story: "Parcours.",

            // Web Cyber
            cyber_title: "Générateur de MDP",
            cyber_lead: "Un tableau de bord de surveillance en temps réel pour analyser les flux réseaux et détecter les anomalies de sécurité.",
            cyber_context_val: "Générateur de Mots de Passe",

            // Web Aviation
            avia_title: "Club D'Aviation",
            avia_lead: "Une refonte complète de l'identité numérique d'un aéroclub, reliant tradition aéronautique et design moderne.",
            avia_obj: "Moderniser l'image vieillissante d'un club amateur pour attirer une audience plus jeune et faciliter les inscriptions aux baptêmes de l'air.",
            avia_learn: "J'ai découvert la réalité de la relation client : traduire des besoins vagues en solutions techniques concrètes. J'ai aussi appris à hacker WordPress pour sortir des templates standards.",
            avia_imp: "Le site est un peu lourd. J'aurais dû mieux optimiser les assets dès le départ et utiliser moins de plugins.",

            // Creative Portfolio
            port_title: "Réservation Universitaire",
            port_lead: "Conception d'une plateforme web pour la gestion des prêts de matériel en université. Le système orchestre un flux de réservation complexe et sécurise les accès grâce à une architecture multi-rôles distincte pour les étudiants, enseignants, agents techniques et administrateurs.",
            res_title: "Réservation Universitaire",
            res_obj: "Digitaliser l'ancien système papier de réservation de salles. Le but était de réduire les conflits d'horaires et de simplifier la vie administrative.",
            res_learn: "Ce projet m'a appris la rigueur de la conception de base de données (MCD/MLD) et l'importance de sécuriser les formulaires contre les injections SQL.",
            res_imp: "Une API RESTful aurait été plus adaptée pour permettre une future application mobile, au lieu du rendu côté serveur.",

            // Web UI Kit (Site Touristique)
            tour_title: "Site Touristique",
            tour_lead: "Un site qui présente ma ville natale. Mon tout premier pas dans le développement web.",
            tour_obj: "Il s'agissait de mon tout premier projet. L'objectif était simple : créer une vitrine pour ma ville natale afin de comprendre comment structurer une page et la styliser.",
            tour_learn: "J'ai appris les concepts fondamentaux : le DOM, le modèle de boîte CSS et l'importance de la sémantique HTML.",
            tour_imp: "Avec du recul, j'aurais dû passer par une étape de maquettage avant de coder. Le responsive et l'optimisation des images auraient aussi pu être mieux gérés.",

            // Vogue Analytics
            vogue_title: "Quiz Python",
            vogue_lead: "Jeu de Quiz réalisé en Python.",

            // Project Data (Gestion Bancaire)
            bank_title: "Gestion Bancaire",
            bank_lead: "Exercice pratique de Programmation Orientée Objet en Java : modélisation d'un système de comptes bancaires avec gestion des dépôts, retraits et virements.",
            bank_c1_title: "1. La Classe Métier",
            bank_c1_text: "Définition de l'objet <code>CompteBancaire</code>. J'apprends ici l'encapsulation (attributs privés) et la création de méthodes pour interagir avec les données (déposer, retirer).",
            bank_c2_title: "2. Gestion de Tableaux",
            bank_c2_text: "Dans le programme principal, j'utilise un tableau <code>CompteBancaire[]</code> pour gérer plusieurs comptes. Les boucles <code>for</code> me permettent d'automatiser les crédits et l'affichage.",
            bank_c3_title: "3. Tests et Validations",
            bank_c3_text: "Une classe dédiée pour tester chaque fonctionnalité : dépôt, retrait (avec gestion d'erreur de solde) et virements entre deux objets compte distincts."
        },
        en: {
            // Generic & Meta
            label_role: "Role",
            label_year: "Year",
            label_tools: "Tools",
            scroll_explore: "SCROLL TO EXPLORE",
            nav_next_edition: "NEXT EDITION →",
            nav_prev_edition: "← PREVIOUS EDITION",
            nav_all_editions: "ALL EDITIONS",

            // Generic Buttons & Labels
            btn_contact_me: "Contact Me",
            back_projects: "← Back to projects",
            btn_doc: "Visit Website",
            btn_visit: "Visit",
            btn_github: "View on GitHub",
            lbl_objectives: "Objectives",
            lbl_stack: "Tech Stack",
            lbl_learning: "Learnings",
            lbl_improvements: "Improvements",
            lbl_source: "Data Source",
            lbl_context: "Context",

            // Web Cyber
            cyber_title: "Password Generator",
            cyber_lead: "A real-time surveillance dashboard to analyze network traffic and detect security anomalies.",
            cyber_context_val: "Password Generator",

            // Web Aviation
            avia_title: "Club D'Aviation",
            avia_lead: "A complete overhaul of an aeroclub's digital identity, bridging aviation tradition with modern design.",
            avia_obj: "Modernize the aging image of an amateur club to attract a younger audience and streamline baptism flight registrations.",
            avia_learn: "I discovered the reality of client relations: translating vague needs into concrete technical solutions. I also learned to hack WordPress to break out of standard templates.",
            avia_imp: "The site is a bit heavy. I should have optimized assets better from the start and used fewer plugins.",

            // Creative Portfolio
            port_title: "University Booking",
            port_lead: "Designed and developed a web platform for university equipment loan management. The system orchestrates a complex reservation workflow and secures access through a distinct multi-role architecture for students, faculty, technical agents, and administrators.",
            res_title: "University Booking",
            res_obj: "Digitize the old paper room booking system. The goal was to reduce schedule conflicts and simplify administrative life.",
            res_learn: "This project taught me database design rigor (CDM/LDM) and the importance of securing forms against SQL injections.",
            res_imp: "A RESTful API would have been more suitable to facilitate a future mobile app, rather than server-side rendering.",

            // Web UI Kit (Site Touristique)
            tour_title: "Tourist Site",
            tour_lead: "A site presenting my hometown. My very first step into web development.",
            tour_obj: "This was my very first project. The goal was simple: create a showcase for my hometown to understand how to structure and style a page.",
            tour_learn: "I learned the fundamental concepts: the DOM, the CSS box model, and the importance of HTML semantics.",
            tour_imp: "In hindsight, I should have wireframed before coding. Responsive design and image optimization could also have been handled better.",

            // Vogue Analytics
            vogue_title: "Python Quiz",
            vogue_lead: "Quiz game created with Python.",

            // Project Data (Gestion Bancaire)
            bank_title: "Banking System",
            bank_lead: "Practical OOP exercise in Java: modeling a bank account system with deposit, withdrawal, and transfer management.",
            bank_c1_title: "1. The Business Class",
            bank_c1_text: "Definition of the <code>CompteBancaire</code> object. Here I learn encapsulation (private attributes) and method creation to interact with data (deposit, withdraw).",
            bank_c2_title: "2. Array Management",
            bank_c2_text: "In the main program, I use a <code>CompteBancaire[]</code> array to manage multiple accounts. <code>for</code> loops allow me to automate credits and display.",
            bank_c3_title: "3. Tests & Validation",
            bank_c3_text: "A dedicated class to test each functionality: deposit, withdrawal (with balance error management), and transfers between distinct account objects.",


            title_story: "Background.",
            // Mag Neon Specifics
            role_neon: "Art Director",

            nav_story: "Background",
            nav_work: "Projects",
            nav_contact: "Contact",
            theme_label: "Theme",
            hero_lead: "As a computer science student, I explore the intersection of data, design, and networks. My portfolio showcases projects where analytical rigor meets visual clarity and structural resilience. I build bridges between numbers, aesthetics, and connectivity.",
            stat_projects: "Projects",
            stat_exp: "Years Exp.",
            stat_stacks: "Stacks",
            sect_selection: "Selection",
            sect_history: "Experience",
            timeline_date_1: "2024 - Present",
            timeline_title_1: "HND Multimedia and Internet",
            timeline_desc_1: "Valedictorian 2024 - 2025",
            timeline_date_2: "SUMMER 2025",
            timeline_title_2: "Junior Data Engineer",
            timeline_desc_2: "Internship - La Banque Postale",
            timeline_date_3: "2020 - 2023",
            timeline_title_3: "André Boulloche High School",
            timeline_desc_3: "High School Diploma in Math & English - With Honors",
            sect_skills: "Skills",
            skills_lead: "A balance between my multimedia foundations and the technical skills I am developing for my professional transition.",
            skills_sub_mmi: "Multimedia Foundations",
            skills_desc_mmi: "Solid skills acquired during my multimedia studies.",
            skills_sub_evo: "Evolving Skills",
            skills_desc_evo: "Technologies for my Cyber & Data transition.",
            sect_watch: "Learning",
            contact_ready: "Ready to collaborate?",
            footer_lang: "Passer en Français",
            footer_cv: "Download CV",

            // Mag Selection
            mag_select_title: "Projects",
            mag_select_lead: "Three aesthetics. Three approaches. Choose an edition.",

            // Works Page
            works_page_title: "Outcomes.",
            works_page_lead: "A global view of my projects: design, data, and web experiments.",
            work_cat_design: "Design & Editorial",
            work_cat_data: "Programmation, Data & Intelligence",
            work_cat_web: "Web & Ecosystems",

            // Mag Structure
            mag_struct_title: "Re-UP",
            mag_struct_lead: "A concept magazine presenting a visual reinterpretation of a legendary hip-hop duo's discography, showcasing sophisticated and impactful mockups of album covers and booklets.",
            // Using generic labels now
            struct_magazine_title: "The Magazine",
            struct_cover_title: "Visual Identity",
            struct_cover_text: "The cover sets the tone with massive typography and absolute contrast. The absence of color forces the eye to focus on structure and information hierarchy.",
            struct_back_title: "Structure & Tracklist",
            struct_back_text: "The back reveals the project's skeleton. The tracklist is not just a list, but an architectural element supporting the global composition.",
            struct_vinyl_title: "The Vinyl Object",
            struct_vinyl_text: "A tangible experience. The design extends to the vinyl with echoes of brutalist codes. The record itself becomes an extension of the graphic architecture.",
            struct_extras_title: "Details & Immersion",
            struct_extras_text: "The experience is completed by a booklet and printed elements exploring textures and layering. Every element tells a part of the story.",

            // Mag Type
            mag_type_title: "Swiss Focus",
            mag_type_lead: "Order, grid and legibility as absolute dogmas.",
            type_analysis_title: "The International Style",
            type_analysis_text: "Homage to the Swiss masters. Exclusive use of a single typographic family and a strict modular grid to achieve objective clarity.",
            type_grid_title: "System & Rigor",
            type_grid_text: "Every element is anchored. White space is not empty, it is active. It defines the structure as much as the text itself.",

            // Mag Neon
            back_select: "← Back to selection",
            mag_neon_lead: "A magazine exploring hip-hop culture icons and the pieces that made them legends.",
            chaos_title: "Organized Chaos",
            chaos_text_1: "The essence of the project lies in the tension between rigidity and disorder. I used a 12-column Swiss modular grid as a foundation, which I deliberately broken with out-of-frame typographic elements and full-bleed images.",
            chaos_text_2: "The choice of typography focused on a mix of a wide Grotesque for titles (immediate visual impact) and a technical mono-space for captions, recalling code and raw data.",
            immersion_title: "VISUAL IMMERSION",
            palette_title: "Palette & texture",
            palette_text: "Deep black contrasts with saturated neon color accents, softened by a digital paper grain that adds tactility to the screen. Each page is designed as an individual poster.",
            webgl_title: "The WebGL Experience",
            webgl_text: "To go beyond the static PDF format, I developed an interactive viewer. Users can manipulate the magazine in 3D, perceive the paper thickness, and see light react on the surface.",
            tech_1: "Three.js for physical rendering (PBR)",
            tech_2: "Page physics with Cannon.js",
            tech_3: "Texture optimization (KTX2)",
            btn_live: "Visit Website",
            btn_code: "Source Code",

            // Navigation
            mag_nav_title: "Other Editions",

            // Contact Page
            contact_title: "Let's Talk.",
            contact_subtitle: "Interested in collaborating or just want to say hi? Fill out this form and I'll get back to you as soon as possible.",
            form_name: "Name",
            form_email: "Email",
            form_message: "Message",
            form_submit: "Send",
            form_success_msg: "Message sent! Thank you for contacting me.",
            form_error_msg: "Error sending message. Please try again.",
            form_sent_btn: "✓ Sent"
        }
    };

    let currentLang = localStorage.getItem('lang') || 'fr';
    const langBtns = [document.getElementById('lang-btn'), document.getElementById('footer-lang-btn')];

    const updateLangUI = () => {
        // Safe check for elements before trying to set text
        const topBtn = document.getElementById('lang-btn');
        const footerBtn = document.getElementById('footer-lang-btn');

        if (topBtn) topBtn.innerText = currentLang === 'en' ? 'EN' : 'FR';
        if (footerBtn && i18n[currentLang].footer_lang) footerBtn.innerText = i18n[currentLang].footer_lang;

        // content updates
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                // If it's an input or textarea with placeholder, update attribute
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // el.placeholder = i18n[currentLang][key]; // Optional: if you had placeholders
                } else {
                    el.innerText = i18n[currentLang][key];
                }
            }
        });

        // Save preference
        localStorage.setItem('lang', currentLang);
    };

    // Initialize UI on load
    updateLangUI();

    langBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'fr' : 'en';
                updateLangUI();
            });
        }
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check saved preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    const isDarkInit = savedTheme === 'dark';
    if (themeIcon) themeIcon.innerText = isDarkInit ? '☾' : '☀';

    const updateThemeUI = (isDark) => {
        if (themeIcon) themeIcon.innerText = isDark ? '☾' : '☀';
    };

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme === 'dark');
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = document.querySelector('.form-submit');
        const notification = document.getElementById('notification');
        // Store the key to restore text properly based on current lang
        const defaultBtnRef = submitBtn.getAttribute('data-i18n');

        const showToast = (message, isError = false) => {
            notification.innerText = message;
            notification.style.background = isError ? '#ff4d4d' : 'var(--text-primary)';
            notification.style.color = isError ? '#fff' : 'var(--bg-color)';
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set Loading State
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'wait';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success Feedback
                    const successMsg = i18n[currentLang].form_success_msg || "Message envoyé !";
                    showToast(successMsg);

                    // Button Success State
                    submitBtn.innerText = i18n[currentLang].form_sent_btn || "✓ Envoyé";
                    submitBtn.style.background = '#4CAF50';
                    submitBtn.style.color = '#fff';
                    submitBtn.style.borderColor = '#4CAF50';

                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        // Restore original text based on current language and key
                        const originalText = i18n[currentLang][defaultBtnRef] || "Envoyer";
                        submitBtn.innerText = originalText;

                        submitBtn.style.background = 'var(--text-primary)';
                        submitBtn.style.color = 'var(--bg-color)';
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.cursor = 'pointer';
                    }, 3000);
                } else {
                    throw new Error('Erreur réseau');
                }
            } catch (error) {
                const errorMsg = i18n[currentLang].form_error_msg || "Erreur...";
                showToast(errorMsg, true);
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');

            if (navLinksContainer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click (if container doesn't cover everything or for safety)
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
