import { Category, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Liste des marques de vêtements populaires
  const clothingBrands = [
    'Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas', 'Puma', 'Levi\'s', 'Gap', 
    'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren', 'Lacoste', 'The North Face',
    'Vans', 'Converse', 'New Balance', 'Under Armour', 'Columbia', 'Patagonia',
    'Mango', 'Guess', 'Diesel', 'G-Star RAW', 'Superdry', 'Hollister', 'Abercrombie & Fitch',
    'Champion', 'Fila', 'Reebok', 'Timberland', 'Burberry', 'Gucci',
    'Louis Vuitton', 'Prada', 'Balenciaga', 'Versace', 'Chanel', 'Dior', 'Saint Laurent',
    'Hermès', 'Armani', 'Dolce & Gabbana', 'Valentino', 'Fendi', 'Givenchy',
    'Balmain', 'Off-White', 'Supreme', 'Thrasher', 'Stone Island', 'Carhartt',
    'Stüssy', 'Comme des Garçons', 'A.P.C.', 'Acne Studios', 'Moncler', 'Canada Goose',
    'Arc\'teryx', 'Fjällräven', 'Lululemon', 'Gymshark', 'ASOS', 'Primark', 'Topshop',
    'Urban Outfitters', 'Forever 21', 'Bershka', 'Pull & Bear', 'Stradivarius', 'Massimo Dutti',
    'COS', 'Weekday', 'Monki', '& Other Stories', 'Arket', 'Everlane', 'Bonobos', 'J.Crew'
  ];

  // Liste des marques de chemises/hauts
  const shirtBrands = [
    'Brooks Brothers', 'Charles Tyrwhitt', 'Thomas Pink', 'T.M.Lewin', 'Hugo Boss',
    'Van Heusen', 'Eton', 'Turnbull & Asser', 'Paul Smith', 'Brunello Cucinelli',
    'Ted Baker', 'Reiss', 'AllSaints', 'Orlebar Brown', 'Robert Graham',
    'Vineyard Vines', 'Supreme', 'Thom Browne', 'Theory', 'Sunspel',
    'Gitman Vintage', 'Ben Sherman', 'Fred Perry', 'Scotch & Soda', 'John Smedley'
  ];

  // Liste des marques de pantalons spécifiques
  const pantsBrands = [
    'Levi\'s', 'Dockers', 'Dickies', 'Lee', 'Wrangler', 'Carhartt', 'G-Star RAW',
    'Nudie Jeans', 'A.P.C.', 'Acne Studios', 'AG Jeans', 'Frame', 'Citizens of Humanity',
    'Madewell', 'Paige', 'True Religion', 'J Brand', 'DL1961', 'Diesel', 'Rag & Bone',
    'Bonobos', 'Banana Republic', 'J.Crew', 'Uniqlo', 'H&M', 'Zara', 'AllSaints',
    'The Gap', 'Stone Island', 'Incotex', 'PT01', 'Asket', 'Outerknown'
  ];

  // Liste des marques de chaussures populaires
  const shoeBrands = [
    'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Vans', 'Converse',
    'Dr. Martens', 'Timberland', 'UGG', 'Crocs', 'Birkenstock', 'Clarks', 'Skechers',
    'Salomon', 'Merrell', 'Hoka One One', 'On Running', 'Brooks', 'Mizuno', 'Keen',
    'Sorel', 'Hunter', 'Teva', 'Havaianas', 'Superga', 'Allbirds', 'Native Shoes',
    'Camper', 'Ecco', 'Geox', 'Steve Madden', 'Aldo', 'Nine West', 'Stuart Weitzman',
    'Jimmy Choo', 'Manolo Blahnik', 'Christian Louboutin', 'Gucci', 'Prada', 'Balenciaga',
    'Versace', 'Saint Laurent', 'Valentino', 'Fendi', 'Off-White', 'Jordan', 'Yeezy',
    'Golden Goose', 'Common Projects', 'Axel Arigato', 'Veja', 'Maison Margiela', 'Tod\'s',
    'Alexander McQueen', 'Giuseppe Zanotti', 'Bottega Veneta', 'Church\'s', 'Allen Edmonds',
    'Alden', 'Red Wing', 'Danner', 'Grenson', 'Tricker\'s', 'Crockett & Jones'
  ];

  // Liste des marques de vestes/manteaux
  const jacketBrands = [
    'Canada Goose', 'The North Face', 'Patagonia', 'Arc\'teryx', 'Moncler', 'Columbia',
    'Barbour', 'Belstaff', 'Herno', 'Woolrich', 'Stone Island', 'C.P. Company',
    'Alpha Industries', 'Carhartt WIP', 'Fjällräven', 'Schott NYC', 'Burberry',
    'Mackage', 'Moose Knuckles', 'Stutterheim', 'Rains', 'Nobis', 'Mackintosh',
    'Acne Studios', 'Uniqlo', 'Zara', 'H&M', 'Topman', 'ASOS', 'Pull & Bear',
    'Burton', 'Quicksilver', 'Volcom', 'Berghaus', 'Mammut', 'Haglöfs'
  ];

  // Liste des marques de bijoux et montres
  const accessoryBrands = [
    'Rolex', 'Omega', 'Tag Heuer', 'Seiko', 'Casio', 'G-Shock', 'Citizen', 'Tissot',
    'Swatch', 'Daniel Wellington', 'Fossil', 'Michael Kors', 'Timex', 'Garmin', 'Fitbit',
    'Apple Watch', 'Samsung Galaxy Watch', 'Cartier', 'Tiffany & Co.', 'Pandora',
    'Swarovski', 'Thomas Sabo', 'Tous', 'Mejuri', 'Monica Vinader', 'Missoma',
    'David Yurman', 'Mikimoto', 'Van Cleef & Arpels', 'Bvlgari', 'Chopard',
    'Piaget', 'Boucheron', 'Pomellato', 'IWC Schaffhausen', 'Breitling', 'Longines',
    'Audemars Piguet', 'Patek Philippe', 'Jaeger-LeCoultre', 'Hublot', 'Vacheron Constantin',
    'Montblanc', 'Bell & Ross', 'Zenith', 'Richard Mille', 'Panerai', 'Oris', 'Tudor'
  ];

  // Liste des marques de chapeau/casquettes
  const hatBrands = [
    'New Era', '47 Brand', 'Mitchell & Ness', 'Supreme', 'Carhartt', 'The North Face',
    'Ralph Lauren', 'Nike', 'Adidas', 'Kangol', 'Brixton', 'Prada', 'Gucci', 'Saint Laurent',
    'Stüssy', 'Goorin Bros', 'Stetson', 'Borsalino', 'Bailey', 'Christys\' London',
    'Lock & Co. Hatters', 'A Bathing Ape', 'Kenzo', 'Maison Michel', 'Larose Paris',
    'Varsity Headwear', 'Anderson & Sheppard', 'Ruslan Baginskiy', 'Lack of Color'
  ];

  // Liste des marques de lingerie et sous-vêtements
  const underwearBrands = [
    'Victoria\'s Secret', 'Calvin Klein', 'Tommy Hilfiger', 'Intimissimi', 'Calzedonia',
    'Triumph', 'Wacoal', 'La Perla', 'Agent Provocateur', 'Savage X Fenty', 'Skims',
    'Aerie', 'Third Love', 'Hanro', 'Wolford', 'Cosabella', 'Spanx', 'Marks & Spencer',
    'H&M', 'Uniqlo', 'Gap', 'Fruit of the Loom', 'Hanes', 'Jockey', 'Mey', 'Schiesser',
    'Sloggi', 'Passionata', 'Chantelle', 'Aubade', 'Simone Perele', 'Lise Charmel',
    'Eres', 'Berlei', 'Bonds', 'Wonderbra', 'Maidenform', 'Dim', 'Etam', 'Saxx', 'MeUndies',
    'Lululemon', 'ExOfficio', 'Patagonia', 'Under Armour', 'Nike', 'Adidas'
  ];

  // Liste des marques de gants
  const glovesBrands = [
    'Dents', 'Hestra', 'Sermoneta', 'UGG', 'The North Face', 'Columbia', 'Patagonia',
    'Arc\'teryx', 'Black Diamond', 'Carhartt', 'Marmot', 'Outdoor Research', 'Gordini',
    'Mountain Hardwear', 'Dakine', 'Burton', 'Reusch', 'Rossignol', 'Salomon', 'Ziener',
    'Fendi', 'Gucci', 'Prada', 'Bottega Veneta', 'Moncler', 'Canada Goose', 'Thom Browne'
  ];

  // Liste des marques de chaussettes
  const socksBrands = [
    'Stance', 'Happy Socks', 'Smartwool', 'Darn Tough', 'Bombas', 'Falke', 'Burlington',
    'Nike', 'Adidas', 'Under Armour', 'Hanes', 'Fruit of the Loom', 'Calvin Klein',
    'Ralph Lauren', 'Uniqlo', 'H&M', 'Gap', 'Muji', 'Pantherella', 'Corgi', 'Anonymous Ism',
    'Tabio', 'Paul Smith', 'Wigwam', 'Balega', 'Feetures', 'Injinji', 'Thorlos'
  ];

  // Liste des marques de bagues
  const ringsBrands = [
    'Tiffany & Co.', 'Cartier', 'Bvlgari', 'Van Cleef & Arpels', 'Harry Winston',
    'Chopard', 'Graff', 'Bucherer', 'De Beers', 'Swarovski', 'Pandora', 'Blue Nile',
    'James Allen', 'David Yurman', 'Mikimoto', 'Boucheron', 'Pomellato', 'Piaget',
    'Mejuri', 'Missoma', 'Monica Vinader', 'Thomas Sabo', 'Tous', 'APM Monaco'
  ];

  // Liste des marques de bracelets
  const braceletsBrands = [
    'Cartier', 'Tiffany & Co.', 'Bvlgari', 'Van Cleef & Arpels', 'David Yurman',
    'Pandora', 'Swarovski', 'Thomas Sabo', 'Tous', 'APM Monaco', 'Miansai',
    'Mejuri', 'Missoma', 'Monica Vinader', 'Alex and Ani', 'Hermès', 'Louis Vuitton',
    'Gucci', 'Montblanc', 'John Hardy', 'Mikimoto', 'Pomellato', 'Boucheron'
  ];

  // Liste des marques de colliers
  const necklacesBrands = [
    'Tiffany & Co.', 'Cartier', 'Bvlgari', 'Van Cleef & Arpels', 'Harry Winston',
    'Chopard', 'Graff', 'Bucherer', 'De Beers', 'Swarovski', 'Pandora', 'David Yurman',
    'Mikimoto', 'Boucheron', 'Pomellato', 'Piaget', 'Mejuri', 'Missoma', 'Monica Vinader',
    'Thomas Sabo', 'Tous', 'APM Monaco', 'Vivienne Westwood', 'Chrome Hearts'
  ];

  console.log(`Début de l'initialisation de la base de données...`);
  
  // Fonction pour créer une marque s'il elle n'existe pas déjà
  async function createBrandIfNotExists(name: string, category: Category) {
    const existingBrand = await prisma.brand.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
    
    if (!existingBrand) {
      await prisma.brand.create({
        data: {
          name,
          category,
        },
      });
    }
  }

  // Créer les marques par catégorie
  for (const brand of clothingBrands) {
    await createBrandIfNotExists(brand, Category.CLOTHING);
  }

  for (const brand of shirtBrands) {
    await createBrandIfNotExists(brand, Category.SHIRTS);
  }

  for (const brand of pantsBrands) {
    await createBrandIfNotExists(brand, Category.PANTS);
  }

  for (const brand of shoeBrands) {
    await createBrandIfNotExists(brand, Category.SHOES);
  }

  for (const brand of jacketBrands) {
    await createBrandIfNotExists(brand, Category.JACKETS);
  }

  for (const brand of accessoryBrands) {
    await createBrandIfNotExists(brand, Category.WATCHES);
  }

  for (const brand of hatBrands) {
    await createBrandIfNotExists(brand, Category.HATS);
  }

  for (const brand of underwearBrands) {
    await createBrandIfNotExists(brand, Category.UNDERWEAR);
  }

  for (const brand of glovesBrands) {
    await createBrandIfNotExists(brand, Category.GLOVES);
  }

  for (const brand of socksBrands) {
    await createBrandIfNotExists(brand, Category.SOCKS);
  }

  for (const brand of ringsBrands) {
    await createBrandIfNotExists(brand, Category.RINGS);
  }

  for (const brand of braceletsBrands) {
    await createBrandIfNotExists(brand, Category.BRACELETS);
  }

  for (const brand of necklacesBrands) {
    await createBrandIfNotExists(brand, Category.NECKLACES);
  }

  // Obtenir le nombre total de marques dans la base de données
  const brandCount = await prisma.brand.count();

  console.log(`Initialisation terminée : ${brandCount} marques dans la base de données`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });