/**
 * Shared mock catalog for Collections + Product detail.
 * @type {Array<{ id: string, name: string, price: number, category: string, sizes: string[], colors: string[], image: string, createdAt: string, description: string, tag?: string, tagVariant?: 'exclusive' | 'limited' }>}
 */
window.VAULT_PRODUCTS = [
  {
    id: "na-hoodie",
    name: "HEAVYWEIGHT HOODIE",
    price: 10500,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoaDeHYiok9I9AWbXszJUGIiOYIAXmWBzDl6HanjVV53bTjiClmKlW5LswHTaT7sD6pR8tlwQK51WNKCeLXiH_iYEuahvprQ0Uq2d181Kr4j4-HYE07WqIxm6tVbiBIEo6aODpolpsMzFpy84EvpQG4jreDCW8m15VuVjt9-fLfpo-NULOuIPzhGmqhlUueEl0TnxKxzJOsf6Tskos1t9ob0HbBkZAZjbOtt86zb0rF1XYFweiQv9vkF70ocJ_luFmxB16HSj41B8",
    createdAt: "2026-05-12",
    description:
      "Rigid boxy cut and a dense matte black shell. Heavy fleece interior, architectural seams, and a hood that holds its own silhouette—built as a structural layer, not a soft basic.",
  },
  {
    id: "na-vest",
    name: "UTILITY VEST 02",
    price: 13800,
    category: "outerwear",
    sizes: ["M", "L", "XL"],
    colors: ["charcoal", "white"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbk9eSPo9MjSpg-cEAnlnZS4tHT-uquxWbOjTRmTOTkqVGi9ruZs7hR7NIivc8agAj-jw_MbdpD6JeAz_Yu3EqK272Sc2naNi3b_fDmVgJmi2DwMfc3VEw7WycBwBSJ-tHDq5Ma0lJUOimYFj1vQRT4LU5BSxS6rO2XqmoGz8Hu-eJVtCo-5J_NJoTfw4nqL2s8JLQHCSq5P18BIVFQPxAUIs9rWE3jl18OP5e7qWCTzqqstZprr5DbIaqWQvVWjdA8BKfoXMWEMg",
    createdAt: "2026-05-11",
    tag: "LIMITED",
    tagVariant: "limited",
    description:
      "Concrete-toned shell with modular cargo pockets and rigid geometry. Shot for high contrast against black—utility as architecture, every seam load-bearing.",
  },
  {
    id: "na-tee",
    name: "OVERSIZED TEE",
    price: 4900,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVkqUdXg4-Kb-PC-O2atZXcov3X6BefX4UlCokklMn1GG2wDsZjoh9odqmNT0XXoJLAYT4J8OlRn24hVvaPzlDzXJz61HdSeyHl3w0mblEc0uIdCmPstyEQSYd-_aPMdiqe01vXBdCXxBS7DpdP1muKj234DHO0TVLmVP77zVUIryyKXxL-TMa5Vrmg5Jkh2sOQ0nkKKXArwXghDHi-nJz_hGBHqw5deGHBiEXAiZyaoiU3E4ow3nzZW-FzKZPMjcI7YQb2knsebs",
    createdAt: "2026-05-10",
    description:
      "Oversized block with a thick rib and dead-flat face. Matte black on matte black—maximum negative space, minimum noise, heavy cotton hand.",
  },
  {
    id: "na-trouser",
    name: "WIDE LEG TROUSER",
    price: 12100,
    category: "bottoms",
    sizes: ["S", "M", "L", "XL"],
    colors: ["charcoal"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCi2v2mOCasOpLNP_AQ1_Qht1fxNBM5qPH_J6lllrfISHJZm1bBCKaXKlzuI6FO00JVaiWpx0POsDg_oL_3UOZlQSrNlVkhaeeBfg9cpGLoGBA5MHl1QV49v-MyWxbB5S-8-6zns4wwGzjLLTuRKLttg6EWzH72Yvkas6NPh6DvTJzvg6h0gwCHu04E5pyFDTu2Es8zeZ5hbUBMmQyABAjI1UL15Too7x0wyTlkypK4F3VgATexFXNfJbMjqk6MhBIYR6TuxsQlW0",
    createdAt: "2026-05-09",
    description:
      "Wide leg, stiff pleat, and a charcoal drape that reads industrial. Grounded silhouette with a pressed center line—trousers as plinth, not drape.",
  },
  {
    id: "p1",
    name: "OBSIDIAN ANORAK",
    price: 12500,
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gold"],
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900",
    createdAt: "2025-01-18",
    tag: "VAULT EXCLUSIVE",
    tagVariant: "exclusive",
    description:
      "A voluminous shell built on a rigid grid: storm flap, taped seams, and deep utility pockets. Matte black shell with interior gold tape accents—designed as a moving piece of architecture, not a seasonal layer.",
  },
  {
    id: "p2",
    name: "FRACTURE DENIM",
    price: 8900,
    category: "bottoms",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["black", "charcoal"],
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900",
    createdAt: "2025-01-02",
    description:
      "Asymmetric panels and raw-edge tension across a heavy black warp. Each seam is offset to catch light like a fault line—streetwear that reads closer to structural engineering than casual denim.",
  },
  {
    id: "p3",
    name: "MONOLITH BOMBER",
    price: 15200,
    category: "outerwear",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["black"],
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900",
    createdAt: "2024-12-20",
    description:
      "Oversized rib geometry and industrial hardware on a dense matte shell. Drop-shoulder massing keeps the silhouette monolithic—minimal surface detail, maximum silhouette.",
  },
  {
    id: "p4",
    name: "STRUCTURE TEE",
    price: 3500,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
    createdAt: "2025-02-01",
    tag: "LIMITED",
    tagVariant: "limited",
    description:
      "Boxy block cut with a high rib and dead-flat face for print or bare monochrome. Heavy cotton keeps the drape architectural—no cling, only planes.",
  },
  {
    id: "p5",
    name: "HEAVY GAUGE KNIT",
    price: 9800,
    category: "tops",
    sizes: ["M", "L", "XL"],
    colors: ["charcoal", "black"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900",
    createdAt: "2024-11-28",
    description:
      "Ribbed collar and cuffs exaggerated for proportion. Dense stitch pattern reads like concrete relief under raking light—warmth without softness.",
  },
  {
    id: "p6",
    name: "TECTONIC RUNNER",
    price: 18000,
    category: "accessories",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "charcoal"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    createdAt: "2025-02-10",
    description:
      "Angular panels and an exaggerated sole stack for a low, wide stance. Monochrome palette keeps focus on silhouette and shadow underfoot.",
  },
  {
    id: "p7",
    name: "BRUTALIST TANK",
    price: 2800,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["white", "black"],
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900",
    createdAt: "2025-01-25",
    description:
      "Wide shoulder, high neck, zero ornament. Built to sit like a column—clean edges, stark negative space, and a weighty hand feel.",
  },
  {
    id: "p8",
    name: "CONCRETE CARGO",
    price: 11200,
    category: "bottoms",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["charcoal", "black", "burgundy"],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900",
    createdAt: "2024-12-05",
    description:
      "Panelled cargos with articulated knees and taped pocket geometry. Charcoal base reads industrial; optional burgundy tape for a controlled accent line.",
  },
  {
    id: "p9",
    name: "RENDER COAT",
    price: 22400,
    category: "outerwear",
    sizes: ["M", "L"],
    colors: ["black", "burgundy"],
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900",
    createdAt: "2025-02-14",
    tag: "VAULT EXCLUSIVE",
    tagVariant: "exclusive",
    description:
      "Floor-length drape with sharp lapels and hidden placket. Designed as a single vertical plane in motion—outerwear that behaves like a façade.",
  },
  {
    id: "p10",
    name: "MONO CAP",
    price: 2400,
    category: "accessories",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gold"],
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900",
    createdAt: "2024-10-30",
    description:
      "Deep crown, flat brim, tonal stitch. Gold-thread option for a thin datum line against black canvas—micro architecture for the head.",
  },
  {
    id: "p11",
    name: "PLINTH WIDE TROUSER",
    price: 13400,
    category: "bottoms",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900",
    createdAt: "2025-01-08",
    description:
      "High waist, aggressive wide leg, and a pressed center crease that refuses to relax. Moves like a plinth: grounded, heavy, deliberate.",
  },
  {
    id: "p12",
    name: "SCAFFOLD VEST",
    price: 8900,
    category: "outerwear",
    sizes: ["M", "L", "XL"],
    colors: ["charcoal", "black"],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900",
    createdAt: "2024-12-18",
    description:
      "Layering vest with webbing channels and modular loops. Charcoal shell with black hardware—utility expressed as line weight and void.",
  },
  {
    id: "p13",
    name: "ASH PULLOVER",
    price: 7200,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["charcoal", "white"],
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900",
    createdAt: "2025-02-03",
    description:
      "Fleece-backed mid layer with a mock neck and offset zip. Ash charcoal body with optional white contrast tape—quiet tonal brutalism.",
  },
  {
    id: "p14",
    name: "VOID MESSENGER",
    price: 5600,
    category: "accessories",
    sizes: ["S", "M", "L"],
    colors: ["black", "burgundy"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
    createdAt: "2024-11-10",
    tag: "LIMITED",
    tagVariant: "limited",
    description:
      "Compact cross-body with hard edges and a single diagonal flap closure. Burgundy interior flash optional—function first, ornament as incision.",
  },
];

window.findVaultProductById = function (id) {
  if (!id || !window.VAULT_PRODUCTS) return null;
  return window.VAULT_PRODUCTS.find(function (p) {
    return p.id === id;
  }) || null;
};
