export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar'

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.wardrobe': 'Wardrobe',
    'nav.outfits': 'Outfits',
    'nav.discover': 'Discover',
    'nav.community': 'Community',
    'nav.calendar': 'Calendar',
    'nav.mood': 'Mood',
    'nav.insights': 'Insights',
    'nav.signOut': 'Sign Out',
    'nav.language': 'Language',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.category': 'Category',
    'common.color': 'Color',
    'common.brand': 'Brand',
    'common.tags': 'Tags',
    'common.image': 'Image',
    'common.photo': 'Photo',
    'common.fullOutfit': 'Full Outfit',
    
    // Outfits
    'outfits.title': 'My Outfits',
    'outfits.description': 'Create and organize your perfect looks',
    'outfits.createOutfit': 'Create Outfit',
    'outfits.createFirst': 'Create Your First Outfit',
    'outfits.fromWardrobe': 'From Wardrobe',
    'outfits.uploadPhoto': 'Upload Photo',
    'outfits.photoOutfit': 'Photo Outfit',
    'outfits.items': 'items',
    'outfits.selectItems': 'Select Items',
    'outfits.uploadOutfitPhoto': 'Upload Outfit Photo',
    'outfits.choosePhoto': 'Choose Photo',
    'outfits.uploadPhotoHint': 'Upload a photo of yourself wearing the outfit',
    'outfits.totalOutfits': 'Total Outfits',
    'outfits.totalItems': 'Total Items',
    'outfits.avgItems': 'Avg Items',
    'outfits.categories': 'Categories',
    
    // Category names
    'category.top': 'Tops',
    'category.bottom': 'Bottoms',
    'category.dress': 'Dresses',
    'category.outerwear': 'Outerwear',
    'category.shoes': 'Shoes',
    'category.accessories': 'Accessories',
    'category.casual': 'Casual',
    'category.formal': 'Formal',
    'category.streetwear': 'Streetwear',
    'category.business': 'Business',
    'category.date': 'Date Night',
    'category.party': 'Party',
    'category.workout': 'Workout',
    
    // Colors
    'color.black': 'Black',
    'color.white': 'White',
    'color.gray': 'Gray',
    'color.navy': 'Navy',
    'color.brown': 'Brown',
    'color.beige': 'Beige',
    'color.red': 'Red',
    'color.pink': 'Pink',
    'color.orange': 'Orange',
    'color.yellow': 'Yellow',
    'color.green': 'Green',
    'color.blue': 'Blue',
    'color.purple': 'Purple',
    'color.teal': 'Teal',
    'color.coral': 'Coral',
    'color.other': 'Other',
    
    // Wardrobe
    'wardrobe.title': 'My Wardrobe',
    'wardrobe.description': 'Your complete digital closet',
    'wardrobe.addItem': 'Add Item',
    'wardrobe.addFirst': 'Add Your First Item',
    'wardrobe.totalItems': 'Total Items',
    'wardrobe.categories': 'Categories',
    'wardrobe.uniqueColors': 'Unique Colors',
    'wardrobe.topColor': 'Top Color',
    
    // Calendar
    'calendar.title': 'My Calendar',
    'calendar.description': 'Plan and track your outfits',
    'calendar.planOutfit': 'Plan Outfit',
    'calendar.today': 'Today',
    
    // Mood
    'mood.title': 'Mood Tracker',
    'mood.description': 'Log how you feel in your outfits',
    'mood.logMood': 'Log Mood',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    
    // Search
    'search.title': 'Discover',
    'search.description': 'Find inspiration and save outfits',
    
    // Community
    'community.title': 'Community Inspiration',
    'community.description': 'Share and discover outfit inspiration',
    'community.shareOutfit': 'Share Your Outfit',
    
    // Insights
    'insights.title': 'Insights',
    'insights.description': 'Discover patterns in your style and mood',
    
    // Additional common phrases
    'common.all': 'All',
    'common.allCategories': 'All Categories',
    'common.selected': 'selected',
    'common.filterByCategory': 'Filter by Category',
    'common.noItems': 'No items',
    'common.noItemsFound': 'No items found',
    'common.tryAdjustingFilters': 'Try adjusting your filters or search query',
    'common.clearFilters': 'Clear Filters',
    'common.results': 'Results',
    'common.of': 'of',
    'common.viewMode': 'View',
    'common.grid': 'Grid',
    'common.list': 'List',
    'common.aiSuggestion': 'AI Suggestion',
    'common.getSuggestion': 'Get Suggestion',
    'common.generating': 'Generating...',
    'common.howDoYouWantToFeel': 'How do you want to feel?',
    'common.editOutfit': 'Edit Outfit',
    'common.createOutfit': 'Create Outfit',
    'common.updateOutfit': 'Update Outfit',
    'common.selectItemsFromWardrobe': 'Select items from your wardrobe to create a complete look',
    'common.chooseHowToCreate': 'Choose how you want to create your outfit',
    'common.updatePhotoOutfit': 'Update your photo outfit',
    'common.updateWardrobeOutfit': 'Update your wardrobe-based outfit',
    'common.itemName': 'Item Name',
    'common.itemImage': 'Item Image',
    'common.uploadImageHint': 'Upload an image of your clothing item. Max 10MB.',
    'common.required': 'required',
    'common.optional': 'optional',
    'common.uploadItem': 'Upload Item',
    'common.updateItem': 'Update Item',
    'common.addNewWardrobeItem': 'Add New Wardrobe Item',
    'common.editWardrobeItem': 'Edit Wardrobe Item',
    'common.detailsOfItem': 'Details of your wardrobe item.',
    'common.separateTagsWithCommas': 'Separate tags with commas (e.g., casual, summer, formal)',
    'common.yourWardrobeIsEmpty': 'Your wardrobe is empty',
    'common.startBuildingCloset': 'Start building your digital closet by adding your first item!',
    'common.noOutfitsYet': 'No outfits yet',
    'common.noOutfitsMatchFilters': 'No outfits match your filters',
    'common.startCreatingLooks': 'Start creating your perfect looks by combining items from your wardrobe!',
    'common.tryAdjustingSearch': 'Try adjusting your search or filters',
    'common.activeFilters': 'Active filters:',
    'common.clearAll': 'Clear all',
    'common.searchByNameDescription': 'Search by name, description, or items...',
    'common.noMoodLogsYet': 'No mood logs yet',
    'common.noMoodLogsMatchFilters': 'No mood logs match your filters',
    'common.startTrackingMoods': 'Start tracking how your outfits make you feel!',
    'common.tryAdjustingYourSearchOrFilters': 'Try adjusting your search or filters',
    'common.logNewMood': 'Log Your Mood',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.wardrobe': 'Armario',
    'nav.outfits': 'Conjuntos',
    'nav.discover': 'Descubrir',
    'nav.community': 'Comunidad',
    'nav.calendar': 'Calendario',
    'nav.mood': 'Estado de Ánimo',
    'nav.insights': 'Perspectivas',
    'nav.signOut': 'Cerrar Sesión',
    'nav.language': 'Idioma',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.close': 'Cerrar',
    'common.submit': 'Enviar',
    'common.name': 'Nombre',
    'common.description': 'Descripción',
    'common.category': 'Categoría',
    'common.color': 'Color',
    'common.brand': 'Marca',
    'common.tags': 'Etiquetas',
    'common.image': 'Imagen',
    'common.photo': 'Foto',
    'common.fullOutfit': 'Conjunto Completo',
    
    // Outfits
    'outfits.title': 'Mis Conjuntos',
    'outfits.description': 'Crea y organiza tus looks perfectos',
    'outfits.createOutfit': 'Crear Conjunto',
    'outfits.createFirst': 'Crea Tu Primer Conjunto',
    'outfits.fromWardrobe': 'Del Armario',
    'outfits.uploadPhoto': 'Subir Foto',
    'outfits.photoOutfit': 'Conjunto con Foto',
    'outfits.items': 'artículos',
    'outfits.selectItems': 'Seleccionar Artículos',
    'outfits.uploadOutfitPhoto': 'Subir Foto del Conjunto',
    'outfits.choosePhoto': 'Elegir Foto',
    'outfits.uploadPhotoHint': 'Sube una foto tuya usando el conjunto',
    'outfits.totalOutfits': 'Total de Conjuntos',
    'outfits.totalItems': 'Total de Artículos',
    'outfits.avgItems': 'Prom. Artículos',
    'outfits.categories': 'Categorías',
    
    // Category names
    'category.top': 'Tops',
    'category.bottom': 'Pantalones',
    'category.dress': 'Vestidos',
    'category.outerwear': 'Abrigos',
    'category.shoes': 'Zapatos',
    'category.accessories': 'Accesorios',
    'category.casual': 'Casual',
    'category.formal': 'Formal',
    'category.streetwear': 'Streetwear',
    'category.business': 'Negocios',
    'category.date': 'Cita',
    'category.party': 'Fiesta',
    'category.workout': 'Deporte',
    
    // Colors
    'color.black': 'Negro',
    'color.white': 'Blanco',
    'color.gray': 'Gris',
    'color.navy': 'Azul Marino',
    'color.brown': 'Marrón',
    'color.beige': 'Beige',
    'color.red': 'Rojo',
    'color.pink': 'Rosa',
    'color.orange': 'Naranja',
    'color.yellow': 'Amarillo',
    'color.green': 'Verde',
    'color.blue': 'Azul',
    'color.purple': 'Morado',
    'color.teal': 'Verde Azulado',
    'color.coral': 'Coral',
    'color.other': 'Otro',
    
    // Wardrobe
    'wardrobe.title': 'Mi Armario',
    'wardrobe.description': 'Tu armario digital completo',
    'wardrobe.addItem': 'Agregar Artículo',
    'wardrobe.addFirst': 'Agrega Tu Primer Artículo',
    'wardrobe.totalItems': 'Total de Artículos',
    'wardrobe.categories': 'Categorías',
    'wardrobe.uniqueColors': 'Colores Únicos',
    'wardrobe.topColor': 'Color Principal',
    
    // Calendar
    'calendar.title': 'Mi Calendario',
    'calendar.description': 'Planifica y rastrea tus conjuntos',
    'calendar.planOutfit': 'Planificar Conjunto',
    'calendar.today': 'Hoy',
    
    // Mood
    'mood.title': 'Registro de Estado de Ánimo',
    'mood.description': 'Registra cómo te sientes con tus conjuntos',
    'mood.logMood': 'Registrar Estado de Ánimo',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.welcome': 'Bienvenido de nuevo',
    
    // Search
    'search.title': 'Descubrir',
    'search.description': 'Encuentra inspiración y guarda conjuntos',
    
    // Community
    'community.title': 'Inspiración de la Comunidad',
    'community.description': 'Comparte y descubre inspiración de conjuntos',
    'community.shareOutfit': 'Comparte Tu Conjunto',
    
    // Insights
    'insights.title': 'Perspectivas',
    'insights.description': 'Descubre patrones en tu estilo y estado de ánimo',
    
    // Additional common phrases
    'common.all': 'Todo',
    'common.allCategories': 'Todas las Categorías',
    'common.selected': 'seleccionado',
    'common.filterByCategory': 'Filtrar por Categoría',
    'common.noItems': 'Sin artículos',
    'common.noItemsFound': 'No se encontraron artículos',
    'common.tryAdjustingFilters': 'Intenta ajustar tus filtros o búsqueda',
    'common.clearFilters': 'Limpiar Filtros',
    'common.results': 'Resultados',
    'common.of': 'de',
    'common.viewMode': 'Vista',
    'common.grid': 'Cuadrícula',
    'common.list': 'Lista',
    'common.aiSuggestion': 'Sugerencia de IA',
    'common.getSuggestion': 'Obtener Sugerencia',
    'common.generating': 'Generando...',
    'common.howDoYouWantToFeel': '¿Cómo quieres sentirte?',
    'common.editOutfit': 'Editar Conjunto',
    'common.createOutfit': 'Crear Conjunto',
    'common.updateOutfit': 'Actualizar Conjunto',
    'common.selectItemsFromWardrobe': 'Selecciona artículos de tu armario para crear un look completo',
    'common.chooseHowToCreate': 'Elige cómo quieres crear tu conjunto',
    'common.updatePhotoOutfit': 'Actualiza tu conjunto con foto',
    'common.updateWardrobeOutfit': 'Actualiza tu conjunto del armario',
    'common.itemName': 'Nombre del Artículo',
    'common.itemImage': 'Imagen del Artículo',
    'common.uploadImageHint': 'Sube una imagen de tu artículo de ropa. Máx. 10MB.',
    'common.required': 'requerido',
    'common.optional': 'opcional',
    'common.uploadItem': 'Subir Artículo',
    'common.updateItem': 'Actualizar Artículo',
    'common.addNewWardrobeItem': 'Agregar Nuevo Artículo al Armario',
    'common.editWardrobeItem': 'Editar Artículo del Armario',
    'common.detailsOfItem': 'Detalles de tu artículo del armario.',
    'common.separateTagsWithCommas': 'Separa las etiquetas con comas (ej., casual, verano, formal)',
    'common.yourWardrobeIsEmpty': 'Tu armario está vacío',
    'common.startBuildingCloset': '¡Comienza a construir tu armario digital agregando tu primer artículo!',
    'common.noOutfitsYet': 'Aún no hay conjuntos',
    'common.noOutfitsMatchFilters': 'Ningún conjunto coincide con tus filtros',
    'common.startCreatingLooks': '¡Comienza a crear tus looks perfectos combinando artículos de tu armario!',
    'common.tryAdjustingSearch': 'Intenta ajustar tu búsqueda o filtros',
    'common.activeFilters': 'Filtros activos:',
    'common.clearAll': 'Limpiar todo',
    'common.searchByNameDescription': 'Buscar por nombre, descripción o artículos...',
    'common.tellUsHowYouWantToFeel': 'Dinos cómo quieres sentirte y te sugeriremos un conjunto',
    'common.items': 'artículos',
    'common.photoOutfit': 'Conjunto con Foto',
    'common.noMoodLogsYet': 'Aún no hay registros de estado de ánimo',
    'common.noMoodLogsMatchFilters': 'No hay registros de estado de ánimo que coincidan con tus filtros',
    'common.startTrackingMoods': '¡Comienza a rastrear cómo te hacen sentir tus conjuntos!',
    'common.tryAdjustingYourSearchOrFilters': 'Intenta ajustar tu búsqueda o filtros',
    'common.logNewMood': 'Registrar Estado de Ánimo',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.wardrobe': 'Garde-robe',
    'nav.outfits': 'Tenues',
    'nav.discover': 'Découvrir',
    'nav.community': 'Communauté',
    'nav.calendar': 'Calendrier',
    'nav.mood': 'Humeur',
    'nav.insights': 'Aperçus',
    'nav.signOut': 'Déconnexion',
    'nav.language': 'Langue',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.create': 'Créer',
    'common.update': 'Mettre à jour',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.close': 'Fermer',
    'common.submit': 'Soumettre',
    'common.name': 'Nom',
    'common.description': 'Description',
    'common.category': 'Catégorie',
    'common.color': 'Couleur',
    'common.brand': 'Marque',
    'common.tags': 'Étiquettes',
    'common.image': 'Image',
    'common.photo': 'Photo',
    'common.fullOutfit': 'Tenue Complète',
    
    // Outfits
    'outfits.title': 'Mes Tenues',
    'outfits.description': 'Créez et organisez vos looks parfaits',
    'outfits.createOutfit': 'Créer une Tenue',
    'outfits.createFirst': 'Créez Votre Première Tenue',
    'outfits.fromWardrobe': 'De la Garde-robe',
    'outfits.uploadPhoto': 'Télécharger une Photo',
    'outfits.photoOutfit': 'Tenue avec Photo',
    'outfits.items': 'articles',
    'outfits.selectItems': 'Sélectionner des Articles',
    'outfits.uploadOutfitPhoto': 'Télécharger une Photo de Tenue',
    'outfits.choosePhoto': 'Choisir une Photo',
    'outfits.uploadPhotoHint': 'Téléchargez une photo de vous portant la tenue',
    
    // Wardrobe
    'wardrobe.title': 'Ma Garde-robe',
    'wardrobe.description': 'Votre garde-robe numérique complète',
    'wardrobe.addItem': 'Ajouter un Article',
    'wardrobe.addFirst': 'Ajoutez Votre Premier Article',
    'wardrobe.totalItems': 'Total d\'Articles',
    'wardrobe.categories': 'Catégories',
    'wardrobe.uniqueColors': 'Couleurs Uniques',
    'wardrobe.topColor': 'Couleur Principale',
    
    // Calendar
    'calendar.title': 'Mon Calendrier',
    'calendar.description': 'Planifiez et suivez vos tenues',
    'calendar.planOutfit': 'Planifier une Tenue',
    'calendar.today': 'Aujourd\'hui',
    
    // Mood
    'mood.title': 'Suivi de l\'Humeur',
    'mood.description': 'Enregistrez comment vous vous sentez dans vos tenues',
    'mood.logMood': 'Enregistrer l\'Humeur',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bon retour',
    
    // Search
    'search.title': 'Découvrir',
    'search.description': 'Trouvez l\'inspiration et enregistrez des tenues',
    
    // Community
    'community.title': 'Inspiration Communautaire',
    'community.description': 'Partagez et découvrez l\'inspiration de tenues',
    'community.shareOutfit': 'Partager Votre Tenue',
    
    // Insights
    'insights.title': 'Aperçus',
    'insights.description': 'Découvrez des modèles dans votre style et votre humeur',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.wardrobe': 'Kleiderschrank',
    'nav.outfits': 'Outfits',
    'nav.discover': 'Entdecken',
    'nav.community': 'Community',
    'nav.calendar': 'Kalender',
    'nav.mood': 'Stimmung',
    'nav.insights': 'Einblicke',
    'nav.signOut': 'Abmelden',
    'nav.language': 'Sprache',
    
    // Common
    'common.loading': 'Lädt...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.view': 'Ansehen',
    'common.create': 'Erstellen',
    'common.update': 'Aktualisieren',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.close': 'Schließen',
    'common.submit': 'Absenden',
    'common.name': 'Name',
    'common.description': 'Beschreibung',
    'common.category': 'Kategorie',
    'common.color': 'Farbe',
    'common.brand': 'Marke',
    'common.tags': 'Tags',
    'common.image': 'Bild',
    'common.photo': 'Foto',
    'common.fullOutfit': 'Vollständiges Outfit',
    
    // Outfits
    'outfits.title': 'Meine Outfits',
    'outfits.description': 'Erstellen und organisieren Sie Ihre perfekten Looks',
    'outfits.createOutfit': 'Outfit Erstellen',
    'outfits.createFirst': 'Erstellen Sie Ihr Erstes Outfit',
    'outfits.fromWardrobe': 'Aus dem Kleiderschrank',
    'outfits.uploadPhoto': 'Foto Hochladen',
    'outfits.photoOutfit': 'Foto-Outfit',
    'outfits.items': 'Artikel',
    'outfits.selectItems': 'Artikel Auswählen',
    'outfits.uploadOutfitPhoto': 'Outfit-Foto Hochladen',
    'outfits.choosePhoto': 'Foto Auswählen',
    'outfits.uploadPhotoHint': 'Laden Sie ein Foto von sich hoch, das das Outfit trägt',
    
    // Wardrobe
    'wardrobe.title': 'Mein Kleiderschrank',
    'wardrobe.description': 'Ihr vollständiger digitaler Kleiderschrank',
    'wardrobe.addItem': 'Artikel Hinzufügen',
    'wardrobe.addFirst': 'Fügen Sie Ihren Ersten Artikel Hinzu',
    'wardrobe.totalItems': 'Gesamtanzahl Artikel',
    'wardrobe.categories': 'Kategorien',
    'wardrobe.uniqueColors': 'Einzigartige Farben',
    'wardrobe.topColor': 'Hauptfarbe',
    
    // Calendar
    'calendar.title': 'Mein Kalender',
    'calendar.description': 'Planen und verfolgen Sie Ihre Outfits',
    'calendar.planOutfit': 'Outfit Planen',
    'calendar.today': 'Heute',
    
    // Mood
    'mood.title': 'Stimmungs-Tracker',
    'mood.description': 'Protokollieren Sie, wie Sie sich in Ihren Outfits fühlen',
    'mood.logMood': 'Stimmung Protokollieren',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Willkommen zurück',
    
    // Search
    'search.title': 'Entdecken',
    'search.description': 'Finden Sie Inspiration und speichern Sie Outfits',
    
    // Community
    'community.title': 'Community-Inspiration',
    'community.description': 'Teilen und entdecken Sie Outfit-Inspiration',
    'community.shareOutfit': 'Ihr Outfit Teilen',
    
    // Insights
    'insights.title': 'Einblicke',
    'insights.description': 'Entdecken Sie Muster in Ihrem Stil und Ihrer Stimmung',
  },
  it: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.wardrobe': 'Guardaroba',
    'nav.outfits': 'Outfit',
    'nav.discover': 'Scopri',
    'nav.community': 'Comunità',
    'nav.calendar': 'Calendario',
    'nav.mood': 'Umore',
    'nav.insights': 'Approfondimenti',
    'nav.signOut': 'Esci',
    'nav.language': 'Lingua',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.view': 'Visualizza',
    'common.create': 'Crea',
    'common.update': 'Aggiorna',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.close': 'Chiudi',
    'common.submit': 'Invia',
    'common.name': 'Nome',
    'common.description': 'Descrizione',
    'common.category': 'Categoria',
    'common.color': 'Colore',
    'common.brand': 'Marca',
    'common.tags': 'Tag',
    'common.image': 'Immagine',
    'common.photo': 'Foto',
    'common.fullOutfit': 'Outfit Completo',
    
    // Outfits
    'outfits.title': 'I Miei Outfit',
    'outfits.description': 'Crea e organizza i tuoi look perfetti',
    'outfits.createOutfit': 'Crea Outfit',
    'outfits.createFirst': 'Crea Il Tuo Primo Outfit',
    'outfits.fromWardrobe': 'Dal Guardaroba',
    'outfits.uploadPhoto': 'Carica Foto',
    'outfits.photoOutfit': 'Outfit con Foto',
    'outfits.items': 'articoli',
    'outfits.selectItems': 'Seleziona Articoli',
    'outfits.uploadOutfitPhoto': 'Carica Foto Outfit',
    'outfits.choosePhoto': 'Scegli Foto',
    'outfits.uploadPhotoHint': 'Carica una foto di te che indossi l\'outfit',
    
    // Wardrobe
    'wardrobe.title': 'Il Mio Guardaroba',
    'wardrobe.description': 'Il tuo guardaroba digitale completo',
    'wardrobe.addItem': 'Aggiungi Articolo',
    'wardrobe.addFirst': 'Aggiungi Il Tuo Primo Articolo',
    'wardrobe.totalItems': 'Totale Articoli',
    'wardrobe.categories': 'Categorie',
    'wardrobe.uniqueColors': 'Colori Unici',
    'wardrobe.topColor': 'Colore Principale',
    
    // Calendar
    'calendar.title': 'Il Mio Calendario',
    'calendar.description': 'Pianifica e traccia i tuoi outfit',
    'calendar.planOutfit': 'Pianifica Outfit',
    'calendar.today': 'Oggi',
    
    // Mood
    'mood.title': 'Tracciamento Umore',
    'mood.description': 'Registra come ti senti nei tuoi outfit',
    'mood.logMood': 'Registra Umore',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Bentornato',
    
    // Search
    'search.title': 'Scopri',
    'search.description': 'Trova ispirazione e salva outfit',
    
    // Community
    'community.title': 'Ispirazione della Comunità',
    'community.description': 'Condividi e scopri ispirazione per outfit',
    'community.shareOutfit': 'Condividi Il Tuo Outfit',
    
    // Insights
    'insights.title': 'Approfondimenti',
    'insights.description': 'Scopri modelli nel tuo stile e umore',
  },
  pt: {
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.wardrobe': 'Guarda-roupa',
    'nav.outfits': 'Looks',
    'nav.discover': 'Descobrir',
    'nav.community': 'Comunidade',
    'nav.calendar': 'Calendário',
    'nav.mood': 'Humor',
    'nav.insights': 'Insights',
    'nav.signOut': 'Sair',
    'nav.language': 'Idioma',
    
    // Common
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.create': 'Criar',
    'common.update': 'Atualizar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.close': 'Fechar',
    'common.submit': 'Enviar',
    'common.name': 'Nome',
    'common.description': 'Descrição',
    'common.category': 'Categoria',
    'common.color': 'Cor',
    'common.brand': 'Marca',
    'common.tags': 'Tags',
    'common.image': 'Imagem',
    'common.photo': 'Foto',
    'common.fullOutfit': 'Look Completo',
    
    // Outfits
    'outfits.title': 'Meus Looks',
    'outfits.description': 'Crie e organize seus looks perfeitos',
    'outfits.createOutfit': 'Criar Look',
    'outfits.createFirst': 'Crie Seu Primeiro Look',
    'outfits.fromWardrobe': 'Do Guarda-roupa',
    'outfits.uploadPhoto': 'Enviar Foto',
    'outfits.photoOutfit': 'Look com Foto',
    'outfits.items': 'itens',
    'outfits.selectItems': 'Selecionar Itens',
    'outfits.uploadOutfitPhoto': 'Enviar Foto do Look',
    'outfits.choosePhoto': 'Escolher Foto',
    'outfits.uploadPhotoHint': 'Envie uma foto sua usando o look',
    
    // Wardrobe
    'wardrobe.title': 'Meu Guarda-roupa',
    'wardrobe.description': 'Seu guarda-roupa digital completo',
    'wardrobe.addItem': 'Adicionar Item',
    'wardrobe.addFirst': 'Adicione Seu Primeiro Item',
    'wardrobe.totalItems': 'Total de Itens',
    'wardrobe.categories': 'Categorias',
    'wardrobe.uniqueColors': 'Cores Únicas',
    'wardrobe.topColor': 'Cor Principal',
    
    // Calendar
    'calendar.title': 'Meu Calendário',
    'calendar.description': 'Planeje e acompanhe seus looks',
    'calendar.planOutfit': 'Planejar Look',
    'calendar.today': 'Hoje',
    
    // Mood
    'mood.title': 'Rastreador de Humor',
    'mood.description': 'Registre como você se sente em seus looks',
    'mood.logMood': 'Registrar Humor',
    
    // Dashboard
    'dashboard.title': 'Painel',
    'dashboard.welcome': 'Bem-vindo de volta',
    
    // Search
    'search.title': 'Descobrir',
    'search.description': 'Encontre inspiração e salve looks',
    
    // Community
    'community.title': 'Inspiração da Comunidade',
    'community.description': 'Compartilhe e descubra inspiração de looks',
    'community.shareOutfit': 'Compartilhar Seu Look',
    
    // Insights
    'insights.title': 'Insights',
    'insights.description': 'Descubra padrões no seu estilo e humor',
  },
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.wardrobe': '衣柜',
    'nav.outfits': '服装',
    'nav.discover': '发现',
    'nav.community': '社区',
    'nav.calendar': '日历',
    'nav.mood': '心情',
    'nav.insights': '洞察',
    'nav.signOut': '登出',
    'nav.language': '语言',
    
    // Common
    'common.loading': '加载中...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.create': '创建',
    'common.update': '更新',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.close': '关闭',
    'common.submit': '提交',
    'common.name': '名称',
    'common.description': '描述',
    'common.category': '类别',
    'common.color': '颜色',
    'common.brand': '品牌',
    'common.tags': '标签',
    'common.image': '图片',
    'common.photo': '照片',
    'common.fullOutfit': '完整服装',
    
    // Outfits
    'outfits.title': '我的服装',
    'outfits.description': '创建和组织您的完美造型',
    'outfits.createOutfit': '创建服装',
    'outfits.createFirst': '创建您的第一套服装',
    'outfits.fromWardrobe': '从衣柜',
    'outfits.uploadPhoto': '上传照片',
    'outfits.photoOutfit': '照片服装',
    'outfits.items': '件',
    'outfits.selectItems': '选择物品',
    'outfits.uploadOutfitPhoto': '上传服装照片',
    'outfits.choosePhoto': '选择照片',
    'outfits.uploadPhotoHint': '上传您穿着该服装的照片',
    
    // Wardrobe
    'wardrobe.title': '我的衣柜',
    'wardrobe.description': '您的完整数字衣柜',
    'wardrobe.addItem': '添加物品',
    'wardrobe.addFirst': '添加您的第一件物品',
    'wardrobe.totalItems': '总物品数',
    'wardrobe.categories': '类别',
    'wardrobe.uniqueColors': '独特颜色',
    'wardrobe.topColor': '主要颜色',
    
    // Calendar
    'calendar.title': '我的日历',
    'calendar.description': '计划和跟踪您的服装',
    'calendar.planOutfit': '计划服装',
    'calendar.today': '今天',
    
    // Mood
    'mood.title': '心情追踪器',
    'mood.description': '记录您在服装中的感受',
    'mood.logMood': '记录心情',
    
    // Dashboard
    'dashboard.title': '仪表板',
    'dashboard.welcome': '欢迎回来',
    
    // Search
    'search.title': '发现',
    'search.description': '寻找灵感并保存服装',
    
    // Community
    'community.title': '社区灵感',
    'community.description': '分享和发现服装灵感',
    'community.shareOutfit': '分享您的服装',
    
    // Insights
    'insights.title': '洞察',
    'insights.description': '发现您的风格和心情模式',
  },
  ja: {
    // Navigation
    'nav.dashboard': 'ダッシュボード',
    'nav.wardrobe': 'ワードローブ',
    'nav.outfits': 'コーデ',
    'nav.discover': '発見',
    'nav.community': 'コミュニティ',
    'nav.calendar': 'カレンダー',
    'nav.mood': '気分',
    'nav.insights': 'インサイト',
    'nav.signOut': 'サインアウト',
    'nav.language': '言語',
    
    // Common
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.view': '表示',
    'common.create': '作成',
    'common.update': '更新',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.close': '閉じる',
    'common.submit': '送信',
    'common.name': '名前',
    'common.description': '説明',
    'common.category': 'カテゴリー',
    'common.color': '色',
    'common.brand': 'ブランド',
    'common.tags': 'タグ',
    'common.image': '画像',
    'common.photo': '写真',
    'common.fullOutfit': 'フルコーデ',
    
    // Outfits
    'outfits.title': 'マイコーデ',
    'outfits.description': '完璧なルックを作成して整理',
    'outfits.createOutfit': 'コーデを作成',
    'outfits.createFirst': '最初のコーデを作成',
    'outfits.fromWardrobe': 'ワードローブから',
    'outfits.uploadPhoto': '写真をアップロード',
    'outfits.photoOutfit': '写真コーデ',
    'outfits.items': 'アイテム',
    'outfits.selectItems': 'アイテムを選択',
    'outfits.uploadOutfitPhoto': 'コーデ写真をアップロード',
    'outfits.choosePhoto': '写真を選択',
    'outfits.uploadPhotoHint': 'コーデを着ているあなたの写真をアップロード',
    
    // Wardrobe
    'wardrobe.title': 'マイワードローブ',
    'wardrobe.description': '完全なデジタルワードローブ',
    'wardrobe.addItem': 'アイテムを追加',
    'wardrobe.addFirst': '最初のアイテムを追加',
    'wardrobe.totalItems': '総アイテム数',
    'wardrobe.categories': 'カテゴリー',
    'wardrobe.uniqueColors': 'ユニークな色',
    'wardrobe.topColor': 'メインカラー',
    
    // Calendar
    'calendar.title': 'マイカレンダー',
    'calendar.description': 'コーデを計画して追跡',
    'calendar.planOutfit': 'コーデを計画',
    'calendar.today': '今日',
    
    // Mood
    'mood.title': '気分トラッカー',
    'mood.description': 'コーデでの気分を記録',
    'mood.logMood': '気分を記録',
    
    // Dashboard
    'dashboard.title': 'ダッシュボード',
    'dashboard.welcome': 'おかえりなさい',
    
    // Search
    'search.title': '発見',
    'search.description': 'インスピレーションを見つけてコーデを保存',
    
    // Community
    'community.title': 'コミュニティインスピレーション',
    'community.description': 'コーデのインスピレーションを共有して発見',
    'community.shareOutfit': 'コーデを共有',
    
    // Insights
    'insights.title': 'インサイト',
    'insights.description': 'スタイルと気分のパターンを発見',
  },
  ko: {
    // Navigation
    'nav.dashboard': '대시보드',
    'nav.wardrobe': '옷장',
    'nav.outfits': '코디',
    'nav.discover': '발견',
    'nav.community': '커뮤니티',
    'nav.calendar': '캘린더',
    'nav.mood': '기분',
    'nav.insights': '인사이트',
    'nav.signOut': '로그아웃',
    'nav.language': '언어',
    
    // Common
    'common.loading': '로딩 중...',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.view': '보기',
    'common.create': '만들기',
    'common.update': '업데이트',
    'common.search': '검색',
    'common.filter': '필터',
    'common.close': '닫기',
    'common.submit': '제출',
    'common.name': '이름',
    'common.description': '설명',
    'common.category': '카테고리',
    'common.color': '색상',
    'common.brand': '브랜드',
    'common.tags': '태그',
    'common.image': '이미지',
    'common.photo': '사진',
    'common.fullOutfit': '전체 코디',
    
    // Outfits
    'outfits.title': '내 코디',
    'outfits.description': '완벽한 룩을 만들고 정리하세요',
    'outfits.createOutfit': '코디 만들기',
    'outfits.createFirst': '첫 번째 코디 만들기',
    'outfits.fromWardrobe': '옷장에서',
    'outfits.uploadPhoto': '사진 업로드',
    'outfits.photoOutfit': '사진 코디',
    'outfits.items': '아이템',
    'outfits.selectItems': '아이템 선택',
    'outfits.uploadOutfitPhoto': '코디 사진 업로드',
    'outfits.choosePhoto': '사진 선택',
    'outfits.uploadPhotoHint': '코디를 입은 자신의 사진을 업로드하세요',
    
    // Wardrobe
    'wardrobe.title': '내 옷장',
    'wardrobe.description': '완전한 디지털 옷장',
    'wardrobe.addItem': '아이템 추가',
    'wardrobe.addFirst': '첫 번째 아이템 추가',
    'wardrobe.totalItems': '총 아이템',
    'wardrobe.categories': '카테고리',
    'wardrobe.uniqueColors': '고유 색상',
    'wardrobe.topColor': '주요 색상',
    
    // Calendar
    'calendar.title': '내 캘린더',
    'calendar.description': '코디를 계획하고 추적하세요',
    'calendar.planOutfit': '코디 계획',
    'calendar.today': '오늘',
    
    // Mood
    'mood.title': '기분 추적기',
    'mood.description': '코디에서의 기분을 기록하세요',
    'mood.logMood': '기분 기록',
    
    // Dashboard
    'dashboard.title': '대시보드',
    'dashboard.welcome': '다시 오신 것을 환영합니다',
    
    // Search
    'search.title': '발견',
    'search.description': '영감을 찾고 코디를 저장하세요',
    
    // Community
    'community.title': '커뮤니티 영감',
    'community.description': '코디 영감을 공유하고 발견하세요',
    'community.shareOutfit': '코디 공유',
    
    // Insights
    'insights.title': '인사이트',
    'insights.description': '스타일과 기분의 패턴을 발견하세요',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.wardrobe': 'خزانة الملابس',
    'nav.outfits': 'الأزياء',
    'nav.discover': 'اكتشف',
    'nav.community': 'المجتمع',
    'nav.calendar': 'التقويم',
    'nav.mood': 'المزاج',
    'nav.insights': 'رؤى',
    'nav.signOut': 'تسجيل الخروج',
    'nav.language': 'اللغة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.create': 'إنشاء',
    'common.update': 'تحديث',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.close': 'إغلاق',
    'common.submit': 'إرسال',
    'common.name': 'الاسم',
    'common.description': 'الوصف',
    'common.category': 'الفئة',
    'common.color': 'اللون',
    'common.brand': 'العلامة التجارية',
    'common.tags': 'العلامات',
    'common.image': 'الصورة',
    'common.photo': 'صورة',
    'common.fullOutfit': 'زي كامل',
    
    // Outfits
    'outfits.title': 'أزيائي',
    'outfits.description': 'أنشئ ونظم مظاهرك المثالية',
    'outfits.createOutfit': 'إنشاء زي',
    'outfits.createFirst': 'أنشئ أول زي لك',
    'outfits.fromWardrobe': 'من خزانة الملابس',
    'outfits.uploadPhoto': 'رفع صورة',
    'outfits.photoOutfit': 'زي بالصورة',
    'outfits.items': 'عناصر',
    'outfits.selectItems': 'اختر العناصر',
    'outfits.uploadOutfitPhoto': 'رفع صورة الزي',
    'outfits.choosePhoto': 'اختر صورة',
    'outfits.uploadPhotoHint': 'ارفع صورة لنفسك ترتدي الزي',
    
    // Wardrobe
    'wardrobe.title': 'خزانة ملابسي',
    'wardrobe.description': 'خزانة ملابسك الرقمية الكاملة',
    'wardrobe.addItem': 'إضافة عنصر',
    'wardrobe.addFirst': 'أضف عنصرك الأول',
    'wardrobe.totalItems': 'إجمالي العناصر',
    'wardrobe.categories': 'الفئات',
    'wardrobe.uniqueColors': 'ألوان فريدة',
    'wardrobe.topColor': 'اللون الرئيسي',
    
    // Calendar
    'calendar.title': 'تقويمي',
    'calendar.description': 'خطط وتتبع أزياءك',
    'calendar.planOutfit': 'تخطيط زي',
    'calendar.today': 'اليوم',
    
    // Mood
    'mood.title': 'تتبع المزاج',
    'mood.description': 'سجل كيف تشعر في أزيائك',
    'mood.logMood': 'تسجيل المزاج',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بعودتك',
    
    // Search
    'search.title': 'اكتشف',
    'search.description': 'ابحث عن الإلهام واحفظ الأزياء',
    
    // Community
    'community.title': 'إلهام المجتمع',
    'community.description': 'شارك واكتشف إلهام الأزياء',
    'community.shareOutfit': 'شارك زيك',
    
    // Insights
    'insights.title': 'رؤى',
    'insights.description': 'اكتشف الأنماط في أسلوبك ومزاجك',
  },
}

export function getTranslation(key: string, language: Language = 'en'): string {
  return translations[language]?.[key] || translations.en[key] || key
}

