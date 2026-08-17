// ---------------------------------------------------------------------------
// Edita este archivo para cambiar los locales / propuestas del evento.
// "id" debe ser único y NUNCA debe cambiarse una vez que ya haya votos
// registrados en Supabase, porque los votos quedan ligados a este id.
// ---------------------------------------------------------------------------

export const PIZZAS = [
  {
    id: "local-01",
    numero: "01",
    localName: "Horno de Tano",
    pizzaName: "Napolitana Clásica",
    ingredients: "Tomate San Marzano, mozzarella fior di latte, albahaca fresca, aceite de oliva",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-02",
    numero: "02",
    localName: "La Cuadra Pizzería",
    pizzaName: "Cuatro Quesos",
    ingredients: "Mozzarella, gorgonzola, parmesano, provolone ahumado",
    image: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-03",
    numero: "03",
    localName: "Fuego Lento",
    pizzaName: "Pepperoni Ahumada",
    ingredients: "Pepperoni artesanal, mozzarella, orégano, chile calabrés",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-04",
    numero: "04",
    localName: "Trattoria Bolívar",
    pizzaName: "Prosciutto e Funghi",
    ingredients: "Jamón serrano, champiñones salteados, mozzarella, tomillo",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-05",
    numero: "05",
    localName: "Masa Madre Co.",
    pizzaName: "Vegetariana del Huerto",
    ingredients: "Calabacín, pimiento asado, cebolla morada, rúgula, queso de cabra",
    image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-06",
    numero: "06",
    localName: "El Rincón Criollo",
    pizzaName: "Costeña de Mariscos",
    ingredients: "Camarones, calamar, ajo, perejil, mozzarella, un toque de coco",
    image: "https://images.unsplash.com/photo-1564936281291-294551497d81?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "local-07",
    numero: "07",
    localName: "Pizzería del Muelle",
    pizzaName: "BBQ de Res Desmechada",
    ingredients: "Res desmechada, salsa BBQ, cebolla caramelizada, mozzarella",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
  },
  // Si tu evento solo tiene 7 locales, borra este último objeto.
  // Si tienes 8, déjalo. El código funciona igual con 7 u 8 propuestas.
  {
    id: "local-08",
    numero: "08",
    localName: "Alto Horno",
    pizzaName: "Trufa y Hongos Silvestres",
    ingredients: "Crema de trufa, mezcla de hongos, mozzarella, parmesano curado",
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=800&auto=format&fit=crop",
  },
];
