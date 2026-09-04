import { useState, useEffect, useCallback } from 'react';
import './ForgeFlips.css';

// Mappatura dei nomi delle ricette agli ID del bazaar Hypixel
const RECIPE_TO_BAZAAR_ID = {
  "Refined Diamond": "REFINED_DIAMOND",
  "Refined Mithril": "REFINED_MITHRIL",
  "Refined Titanium": "REFINED_TITANIUM",
  "Refined Tungsten": "REFINED_TUNGSTEN",
  "Refined Umber": "REFINED_UMBER",
  "Fuel Canister": "FUEL_CANISTER",
  "Bejeweled Handle": "BEJEWELED_HANDLE",
  "Drill Motor": "DRILL_MOTOR",
  "Golden Plate": "GOLDEN_PLATE",
  "Mithril Plate": "MITHRIL_PLATE",
  "Tungsten Plate": "TUNGSTEN_PLATE",
  "Umber Plate": "UMBER_PLATE",
  "Gemstone Mixture": "GEMSTONE_MIXTURE",
  "Glacite Amalgamation": "GLACITE_AMALGAMATION",
  "Perfect Jasper Gemstone": "PERFECT_JASPER_GEMSTONE",
  "Perfect Ruby Gemstone": "PERFECT_RUBY_GEMSTONE",
  "Perfect Jade Gemstone": "PERFECT_JADE_GEMSTONE",
  "Perfect Sapphire Gemstone": "PERFECT_SAPPHIRE_GEMSTONE",
  "Perfect Amber Gemstone": "PERFECT_AMBER_GEMSTONE",
  "Perfect Topaz Gemstone": "PERFECT_TOPAZ_GEMSTONE",
  "Perfect Amethyst Gemstone": "PERFECT_AMETHYST_GEMSTONE",
  "Perfect Opal Gemstone": "PERFECT_OPAL_GEMSTONE",
  "Perfect Onyx Gemstone": "PERFECT_ONYX_GEMSTONE",
  "Perfect Citrine Gemstone": "PERFECT_CITRINE_GEMSTONE",
  "Perfect Aquamarine Gemstone": "PERFECT_AQUAMARINE_GEMSTONE",
  "Perfect Peridot Gemstone": "PERFECT_PERIDOT_GEMSTONE",
  "Perfect Plate": "PERFECT_PLATE",
  "Beacon II": "BEACON_II",
  "Beacon III": "BEACON_III",
  "Beacon IV": "BEACON_IV",
  "Beacon V": "BEACON_V",
  "Titanium Talisman": "TITANIUM_TALISMAN",
  "Diamonite": "DIAMONITE",
  "Pocket Iceberg": "POCKET_ICEBERG",
  "Power Crystal": "POWER_CRYSTAL",
  "Bejeweled Collar": "BEJEWELED_COLLAR",
  "Mithril Gauntlet": "MITHRIL_GAUNTLET",
  "Mithril Belt": "MITHRIL_BELT",
  "Mithril Cloak": "MITHRIL_CLOAK",
  "Mithril Necklace": "MITHRIL_NECKLACE",
  "Chisel": "CHISEL",
  "Tungsten Key": "TUNGSTEN_KEY",
  "Umber Key": "UMBER_KEY",
  "Frigid Husk": "FRIGID_HUSK",
  "Mithril Drill SX-R226": "MITHRIL_DRILL_1",
  "Mithril-Infused Fuel Tank": "MITHRIL_FUEL_TANK",
  "Mithril-Plated Drill Engine": "MITHRIL_DRILL_ENGINE",
  "Titanium Ring": "TITANIUM_RING",
  "Pure Mithril": "PURE_MITHRIL",
  "Titanium Tesseract": "TITANIUM_TESSERACT",
  "Dwarven Geode": "DWARPEN_GEODE",
  "Petrified Starfall": "PETRIFIED_STARFALL",
  "Pesto Goblin Omelette": "PESTO_OMELETTE",
  "Ammonite": "AMMONITE",
  "Ruby Drill TX-15": "RUBY_DRILL",
  "Titanium Gauntlet": "TITANIUM_GAUNTLET",
  "Titanium Belt": "TITANIUM_BELT",
  "Titanium Cloak": "TITANIUM_CLOAK",
  "Titanium Necklace": "TITANIUM_NECKLACE",
  "Mole": "MOLE",
  "Mithril Drill SX-R326": "MITHRIL_DRILL_2",
  "Titanium-Plated Drill Engine": "TITANIUM_DRILL_ENGINE",
  "Goblin Omelette": "GOBLIN_OMELETTE",
  "Beacon IV": "BEACON_IV",
  "Titanium Artifact": "TITANIUM_ARTIFACT",
  "Scorched Topaz": "SCORCHED_TOPAZ",
  "Sunny Side Goblin Omelette": "SUNNY_SIDE_OMELETTE",
  "Gemstone Drill LT-522": "GEMSTONE_DRILL",
  "Gleaming Crystal": "GLEAMING_CRYSTAL",
  "Titanium Drill DR-X355": "TITANIUM_DRILL_1",
  "Titanium Drill DR-X455": "TITANIUM_DRILL_2",
  "Titanium Drill DR-X555": "TITANIUM_DRILL_3",
  "Titanium-Infused Fuel Tank": "TITANIUM_FUEL_TANK",
  "Beacon V": "BEACON_V",
  "Titanium Relic": "TITANIUM_RELIC",
  "Spicy Goblin Omelette": "SPICY_OMELETTE",
  "Gemstone Chamber": "GEMSTONE_CHAMBER",
  "Topaz Drill KGR-12": "TOPAZ_DRILL",
  "Ruby-Polished Drill Engine": "RUBY_DRILL_ENGINE",
  "Gemstone Fuel Tank": "GEMSTONE_FUEL_TANK",
  "Amethyst Gauntlet": "AMETHYST_GAUNTLET",
  "Jade Belt": "JADE_BELT",
  "Sapphire Cloak": "SAPPHIRE_CLOAK",
  "Amber Necklace": "AMBER_NECKLACE",
  "Blue Cheese Goblin Omelette": "BLUE_CHEESE_OMELETTE",
  "Titanium Drill DR-X655": "TITANIUM_DRILL_4",
  "Jasper Drill X": "JASPER_DRILL",
  "Sapphire-Polished Drill Engine": "SAPPHIRE_DRILL_ENGINE",
  "Amber Material": "AMBER_MATERIAL",
  "Helmet Of Divan": "DIVAN_HELMET",
  "Chestplate Of Divan": "DIVAN_CHESTPLATE",
  "Leggings Of Divan": "DIVAN_LEGGINGS",
  "Boots Of Divan": "DIVAN_BOOTS",
  "Amber-Polished Drill Engine": "AMBER_DRILL_ENGINE",
  "Perfectly-Cut Fuel Tank": "PERFECT_FUEL_TANK",
  "Divan's Drill": "DIVAN_DRILL",
  "Divan's Powder Coating": "DIVAN_POWDER_COATING",
  "Secret Railroad Pass": "RAILROAD_PASS",
  "T-Rex": "T_REX",
  "Spinosaurus": "SPINOSAURUS",
  "Goblin": "GOBLIN",
  "Ankylosaurus": "ANKYLOSAURUS",
  "Penguin": "PENGUIN",
  "Mammoth": "MAMMOTH",
  "Dwarven Handwarmers": "HANDWARMERS",
  "Reinforced Chisel": "REINFORCED_CHISEL",
  "Dwarven Metal Talisman": "DWARPEN_METAL_TALISMAN",
  "Portable Campfire": "PORTABLE_CAMPFIRE",
  "Tungsten Regulator": "TUNGSTEN_REGULATOR",
  "Glacite-Plated Chisel": "GLACITE_PLATED_CHISEL",
  "Perfect Chisel": "PERFECT_CHISEL",
  "Relic of Power": "RELIC_OF_POWER",
  "Skeleton Key": "SKELETON_KEY",
};

// Dati completi delle ricette della forge (114 items)
const FORGE_RECIPES = [
  { name: "Refined Diamond", timeHours: 8, materials: { ENCHANTED_DIAMOND_BLOCK: 2 } },
  { name: "Refined Mithril", timeHours: 6, materials: { ENCHANTED_MITHRIL: 160 } },
  { name: "Refined Titanium", timeHours: 12, materials: { ENCHANTED_TITANIUM: 16 } },
  { name: "Refined Tungsten", timeHours: 1, materials: { ENCHANTED_TUNGSTEN: 160 } },
  { name: "Refined Umber", timeHours: 1, materials: { ENCHANTED_UMBER: 160 } },
  { name: "Fuel Canister", timeHours: 10, materials: { ENCHANTED_COAL_BLOCK: 2 } },
  { name: "Bejeweled Handle", timeHours: 0.008333, materials: { GLACITE_JEWEL: 3 } },
  { name: "Drill Motor", timeHours: 30, materials: { ENCHANTED_IRON_BLOCK: 1, ENCHANTED_REDSTONE_BLOCK: 3, GOLDEN_PLATE: 1, TREASURITE: 10 } },
  { name: "Golden Plate", timeHours: 6, materials: { ENCHANTED_GOLD_BLOCK: 2, GLACITE_JEWEL: 5, REFINED_DIAMOND: 1 } },
  { name: "Mithril Plate", timeHours: 18, materials: { REFINED_MITHRIL: 5, GOLDEN_PLATE: 1, ENCHANTED_IRON_BLOCK: 1, REFINED_TITANIUM: 1 } },
  { name: "Tungsten Plate", timeHours: 3, materials: { REFINED_TUNGSTEN: 4, GLACITE_AMALGAMATION: 1 } },
  { name: "Umber Plate", timeHours: 3, materials: { REFINED_UMBER: 4, GLACITE_AMALGAMATION: 1 } },
  { name: "Gemstone Mixture", timeHours: 4, materials: { FINE_JADE_GEMSTONE: 4, FINE_AMBER_GEMSTONE: 4, FINE_AMETHYST_GEMSTONE: 4, FINE_SAPPHIRE_GEMSTONE: 4, SLUDGE_JUICE: 320 } },
  { name: "Glacite Amalgamation", timeHours: 4, materials: { FINE_ONYX_GEMSTONE: 4, FINE_AQUAMARINE_GEMSTONE: 4, FINE_CITRINE_GEMSTONE: 4, FINE_PERIDOT_GEMSTONE: 4, ENCHANTED_GLACITE: 256 } },
  { name: "Perfect Jasper Gemstone", timeHours: 20, materials: { FLAWLESS_JASPER_GEMSTONE: 5, JASPER_CRYSTAL: 1 } },
  { name: "Perfect Ruby Gemstone", timeHours: 20, materials: { FLAWLESS_RUBY_GEMSTONE: 5, RUBY_CRYSTAL: 1 } },
  { name: "Perfect Jade Gemstone", timeHours: 20, materials: { FLAWLESS_JADE_GEMSTONE: 5, JADE_CRYSTAL: 1 } },
  { name: "Perfect Sapphire Gemstone", timeHours: 20, materials: { FLAWLESS_SAPPHIRE_GEMSTONE: 5, SAPPHIRE_CRYSTAL: 1 } },
  { name: "Perfect Amber Gemstone", timeHours: 20, materials: { FLAWLESS_AMBER_GEMSTONE: 5, AMBER_CRYSTAL: 1 } },
  { name: "Perfect Topaz Gemstone", timeHours: 20, materials: { FLAWLESS_TOPAZ_GEMSTONE: 5, TOPAZ_CRYSTAL: 1 } },
  { name: "Perfect Amethyst Gemstone", timeHours: 20, materials: { FLAWLESS_AMETHYST_GEMSTONE: 5, AMETHYST_CRYSTAL: 1 } },
  { name: "Perfect Opal Gemstone", timeHours: 20, materials: { FLAWLESS_OPAL_GEMSTONE: 5, OPAL_CRYSTAL: 1 } },
  { name: "Perfect Onyx Gemstone", timeHours: 20, materials: { FLAWLESS_ONYX_GEMSTONE: 5, ONYX_CRYSTAL: 1 } },
  { name: "Perfect Citrine Gemstone", timeHours: 20, materials: { FLAWLESS_CITRINE_GEMSTONE: 5, CITRINE_CRYSTAL: 1 } },
  { name: "Perfect Aquamarine Gemstone", timeHours: 20, materials: { FLAWLESS_AQUAMARINE_GEMSTONE: 5, AQUAMARINE_CRYSTAL: 1 } },
  { name: "Perfect Peridot Gemstone", timeHours: 20, materials: { FLAWLESS_PERIDOT_GEMSTONE: 5, PERIDOT_CRYSTAL: 1 } },
  { name: "Perfect Plate", timeHours: 6, materials: { UMBER_PLATE: 1, TUNGSTEN_PLATE: 1, MITHRIL_PLATE: 1 } },
  { name: "Beacon II", timeHours: 20, materials: { BEACON_I: 1, REFINED_MITHRIL: 5 } },
  { name: "Titanium Talisman", timeHours: 14, materials: { REFINED_TITANIUM: 2 } },
  { name: "Diamonite", timeHours: 6, materials: { REFINED_DIAMOND: 3 } },
  { name: "Pocket Iceberg", timeHours: 6, materials: { GLACITE_JEWEL: 5 } },
  { name: "Power Crystal", timeHours: 2, materials: { STARFALL: 256 } },
  { name: "Travel Scroll to the Dwarven Forge", timeHours: 5, materials: { MITHRIL: 48, TITANIUM: 80, ENCHANTED_ENDER_PEARL: 16, COINS: 25000 } },
  { name: "Bejeweled Collar", timeHours: 2, materials: { BEJEWELED_HANDLE: 1, REFINED_MITHRIL: 4 } },
  { name: "Mithril Gauntlet", timeHours: 1, materials: { ENCHANTED_MITHRIL: 3 } },
  { name: "Mithril Belt", timeHours: 1, materials: { ENCHANTED_MITHRIL: 3 } },
  { name: "Mithril Cloak", timeHours: 1, materials: { ENCHANTED_MITHRIL: 3 } },
  { name: "Mithril Necklace", timeHours: 1, materials: { ENCHANTED_MITHRIL: 3 } },
  { name: "Chisel", timeHours: 0.008333, materials: { BEJEWELED_HANDLE: 1, TUNGSTEN: 64 } },
  { name: "Tungsten Key", timeHours: 0.5, materials: { ENCHANTED_TUNGSTEN: 192, BEJEWELED_HANDLE: 1 } },
  { name: "Umber Key", timeHours: 0.5, materials: { ENCHANTED_UMBER: 192, BEJEWELED_HANDLE: 1 } },
  { name: "Frigid Husk", timeHours: 6, materials: { GLACITE_AMALGAMATION: 4, FLAWLESS_ONYX_GEMSTONE: 1 } },
  { name: "Travel Scroll to the Dwarven Base Camp", timeHours: 10, materials: { FLAWLESS_ONYX_GEMSTONE: 1, ENCHANTED_ENDER_PEARL: 16, COINS: 500000 } },
  { name: "Mithril Drill SX-R226", timeHours: 4, materials: { DRILL_ENGINE: 1, REFINED_MITHRIL: 3, FUEL_TANK: 1 } },
  { name: "Mithril-Infused Fuel Tank", timeHours: 10, materials: { REFINED_DIAMOND: 5, REFINED_MITHRIL: 10, FUEL_TANK: 5 } },
  { name: "Mithril-Plated Drill Engine", timeHours: 15, materials: { DRILL_ENGINE: 2, MITHRIL_PLATE: 3 } },
  { name: "Beacon III", timeHours: 30, materials: { BEACON_II: 1, REFINED_MITHRIL: 10 } },
  { name: "Titanium Ring", timeHours: 20, materials: { REFINED_TITANIUM: 6, TITANIUM_TALISMAN: 1 } },
  { name: "Pure Mithril", timeHours: 6, materials: { REFINED_MITHRIL: 2 } },
  { name: "Titanium Tesseract", timeHours: 6, materials: { REFINED_TITANIUM: 1, ENCHANTED_LAPIS_LAZULI: 16 } },
  { name: "Dwarven Geode", timeHours: 6, materials: { ENCHANTED_COBBLESTONE: 128, TREASURITE: 64 } },
  { name: "Petrified Starfall", timeHours: 6, materials: { STARFALL: 512 } },
  { name: "Pesto Goblin Omelette", timeHours: 20, materials: { GREEN_GOBLIN_EGG: 99, FINE_JADE_GEMSTONE: 1 } },
  { name: "Ammonite", timeHours: 72, materials: { HELIX_FOSSIL: 1, COINS: 300000 } },
  { name: "Ruby Drill TX-15", timeHours: 1, materials: { DRILL_ENGINE: 1, FUEL_TANK: 1, FINE_RUBY_GEMSTONE: 6 } },
  { name: "Titanium Gauntlet", timeHours: 4.5, materials: { REFINED_MINERAL: 16, REFINED_TITANIUM: 1, MITHRIL_GAUNTLET: 1 } },
  { name: "Titanium Belt", timeHours: 4.5, materials: { REFINED_MINERAL: 16, REFINED_TITANIUM: 1, MITHRIL_BELT: 1 } },
  { name: "Titanium Cloak", timeHours: 4.5, materials: { REFINED_MINERAL: 16, REFINED_TITANIUM: 1, MITHRIL_CLOAK: 1 } },
  { name: "Titanium Necklace", timeHours: 4.5, materials: { REFINED_MINERAL: 16, REFINED_TITANIUM: 1, MITHRIL_NECKLACE: 1 } },
  { name: "Mole", timeHours: 72, materials: { CLAW_FOSSIL: 1, COINS: 300000 } },
  { name: "Mithril Drill SX-R326", timeHours: 0.008333, materials: { MITHRIL_DRILL_SX_R226: 1, GOLDEN_PLATE: 5, MITHRIL_PLATE: 1 } },
  { name: "Titanium-Plated Drill Engine", timeHours: 30, materials: { DRILL_ENGINE: 10, PLASMA: 5, MITHRIL_PLATE: 4, REFINED_TITANIUM: 5 } },
  { name: "Goblin Omelette", timeHours: 18, materials: { GOBLIN_EGG: 99 } },
  { name: "Beacon IV", timeHours: 40, materials: { BEACON_III: 1, REFINED_MITHRIL: 20, PLASMA: 1 } },
  { name: "Titanium Artifact", timeHours: 36, materials: { REFINED_TITANIUM: 12, TITANIUM_RING: 1 } },
  { name: "Scorched Topaz", timeHours: 6, materials: { ENCHANTED_HARD_STONE: 128, FLAWLESS_TOPAZ_GEMSTONE: 1 } },
  { name: "Sunny Side Goblin Omelette", timeHours: 20, materials: { YELLOW_GOBLIN_EGG: 99, FINE_TOPAZ_GEMSTONE: 1 } },
  { name: "Gemstone Drill LT-522", timeHours: 0.008333, materials: { RUBY_DRILL_TX_15: 1, GEMSTONE_MIXTURE: 3 } },
  { name: "Gleaming Crystal", timeHours: 6, materials: { GLOSSY_GEMSTONE: 32, REFINED_MITHRIL: 1, REFINED_DIAMOND: 2 } },
  { name: "Titanium Drill DR-X355", timeHours: 64, materials: { DRILL_ENGINE: 1, FUEL_TANK: 1, GOLDEN_PLATE: 6, REFINED_TITANIUM: 10, REFINED_MITHRIL: 10 } },
  { name: "Titanium Drill DR-X455", timeHours: 0.008333, materials: { TITANIUM_DRILL_DR_X355: 1, REFINED_DIAMOND: 10, REFINED_TITANIUM: 16, MITHRIL_PLATE: 6 } },
  { name: "Titanium Drill DR-X555", timeHours: 0.008333, materials: { TITANIUM_DRILL_DR_X455: 1, REFINED_DIAMOND: 20, REFINED_TITANIUM: 32, ENCHANTED_IRON_BLOCK: 2, MITHRIL_PLATE: 15, PLASMA: 20 } },
  { name: "Titanium-Infused Fuel Tank", timeHours: 25, materials: { MITHRIL_INFUSED_FUEL_TANK: 1, REFINED_TITANIUM: 10, REFINED_DIAMOND: 5, FUEL_TANK: 5 } },
  { name: "Beacon V", timeHours: 50, materials: { BEACON_IV: 1, REFINED_MITHRIL: 40, PLASMA: 5 } },
  { name: "Titanium Relic", timeHours: 72, materials: { REFINED_TITANIUM: 20, TITANIUM_ARTIFACT: 1 } },
  { name: "Spicy Goblin Omelette", timeHours: 20, materials: { RED_GOBLIN_EGG: 99, FLAWLESS_RUBY_GEMSTONE: 1 } },
  { name: "Gemstone Chamber", timeHours: 4, materials: { WORM_MEMBRANE: 100, GEMSTONE_MIXTURE: 1, COINS: 25000 } },
  { name: "Topaz Drill KGR-12", timeHours: 0.008333, materials: { GEMSTONE_DRILL_LT_522: 1, FLAWLESS_TOPAZ_GEMSTONE: 1, GEMSTONE_MIXTURE: 3, MAGMA_CORE: 5 } },
  { name: "Ruby-Polished Drill Engine", timeHours: 20, materials: { MITHRIL_PLATED_DRILL_ENGINE: 1, SUPERLITE_MOTOR: 10, FINE_RUBY_GEMSTONE: 10 } },
  { name: "Gemstone Fuel Tank", timeHours: 30, materials: { TITANIUM_INFUSED_FUEL_TANK: 1, CONTROL_SWITCH: 30, GEMSTONE_MIXTURE: 10 } },
  { name: "Amethyst Gauntlet", timeHours: 24, materials: { GLOSSY_GEMSTONE: 32, FLAWLESS_AMETHYST_GEMSTONE: 2 } },
  { name: "Jade Belt", timeHours: 24, materials: { GLOSSY_GEMSTONE: 32, FLAWLESS_JADE_GEMSTONE: 2 } },
  { name: "Sapphire Cloak", timeHours: 24, materials: { GLOSSY_GEMSTONE: 32, FLAWLESS_SAPPHIRE_GEMSTONE: 2 } },
  { name: "Amber Necklace", timeHours: 24, materials: { GLOSSY_GEMSTONE: 32, FLAWLESS_AMBER_GEMSTONE: 2 } },
  { name: "Blue Cheese Goblin Omelette", timeHours: 20, materials: { PERFECT_SAPPHIRE_GEMSTONE: 1, BLUE_GOBLIN_EGG: 99 } },
  { name: "Titanium Drill DR-X655", timeHours: 0.008333, materials: { TITANIUM_DRILL_DR_X555: 1, CORLEONITE: 30, FLAWLESS_RUBY_GEMSTONE: 1, REFINED_DIAMOND: 5, GEMSTONE_MIXTURE: 16, REFINED_TITANIUM: 12, MITHRIL_PLATE: 5 } },
  { name: "Jasper Drill X", timeHours: 0.008333, materials: { TOPAZ_DRILL_KGR_12: 1, FLAWLESS_JASPER_GEMSTONE: 1, TREASURITE: 100 } },
  { name: "Sapphire-Polished Drill Engine", timeHours: 20, materials: { TITANIUM_PLATED_DRILL_ENGINE: 1, ELECTRON_TRANSMITTER: 25, FTX_3070: 25, FINE_SAPPHIRE_GEMSTONE: 20 } },
  { name: "Amber Material", timeHours: 6, materials: { FINE_AMBER_GEMSTONE: 12, GOLDEN_PLATE: 1 } },
  { name: "Helmet Of Divan", timeHours: 23, materials: { DIVAN_FRAGMENT: 5, GEMSTONE_MIXTURE: 10, FLAWLESS_RUBY_GEMSTONE: 1 } },
  { name: "Chestplate Of Divan", timeHours: 23, materials: { DIVAN_FRAGMENT: 8, GEMSTONE_MIXTURE: 10, FLAWLESS_RUBY_GEMSTONE: 1 } },
  { name: "Leggings Of Divan", timeHours: 23, materials: { DIVAN_FRAGMENT: 7, GEMSTONE_MIXTURE: 10, FLAWLESS_RUBY_GEMSTONE: 1 } },
  { name: "Boots Of Divan", timeHours: 23, materials: { DIVAN_FRAGMENT: 4, GEMSTONE_MIXTURE: 10, FLAWLESS_RUBY_GEMSTONE: 1 } },
  { name: "Amber-Polished Drill Engine", timeHours: 50, materials: { RUBY_POLISHED_DRILL_ENGINE: 1, SAPPHIRE_POLISHED_DRILL_ENGINE: 1, FLAWLESS_AMBER_GEMSTONE: 1, ROBOTRON_REFLECTOR: 50 } },
  { name: "Perfectly-Cut Fuel Tank", timeHours: 50, materials: { GEMSTONE_FUEL_TANK: 1, GEMSTONE_MIXTURE: 25, SYNTHETIC_HEART: 70 } },
  { name: "Divan's Drill", timeHours: 60, materials: { DIVAN_ALLOY: 1, TITANIUM_DRILL_DR_X655: 1, COINS: 50000000 } },
  { name: "Divan's Powder Coating", timeHours: 36, materials: { GLOSSY_GEMSTONE: 32, REFINED_MINERAL: 32, DIVAN_FRAGMENT: 5, ENCHANTED_GOLD_BLOCK: 16 } },
  { name: "Secret Railroad Pass", timeHours: 0.008333, materials: { FLAWLESS_RUBY_GEMSTONE: 1, REFINED_MITHRIL: 2, CORLEONITE: 8 } },
  { name: "T-Rex", timeHours: 168, materials: { FOOTPRINT_FOSSIL: 1, FLAWLESS_ONYX_GEMSTONE: 1 } },
  { name: "Spinosaurus", timeHours: 168, materials: { SPINE_FOSSIL: 1, FLAWLESS_AQUAMARINE_GEMSTONE: 1 } },
  { name: "Goblin", timeHours: 168, materials: { UGLY_FOSSIL: 1, FLAWLESS_AMBER_GEMSTONE: 1 } },
  { name: "Ankylosaurus", timeHours: 168, materials: { CLUBBED_FOSSIL: 1, FLAWLESS_OPAL_GEMSTONE: 1 } },
  { name: "Penguin", timeHours: 168, materials: { WEBBED_FOSSIL: 1, FLAWLESS_AQUAMARINE_GEMSTONE: 1 } },
  { name: "Mammoth", timeHours: 168, materials: { TUSK_FOSSIL: 1, FLAWLESS_ONYX_GEMSTONE: 1 } },
  { name: "Dwarven Handwarmers", timeHours: 4, materials: { UMBER_PLATE: 1, TUNGSTEN_PLATE: 1, FLAWLESS_JADE_GEMSTONE: 1, FLAWLESS_AMBER_GEMSTONE: 1 } },
  { name: "Reinforced Chisel", timeHours: 12, materials: { CHISEL: 1, REFINED_TUNGSTEN: 2, REFINED_UMBER: 2, BEJEWELED_HANDLE: 1 } },
  { name: "Dwarven Metal Talisman", timeHours: 24, materials: { REFINED_UMBER: 4, REFINED_TUNGSTEN: 4, GLACITE_AMALGAMATION: 4 } },
  { name: "Portable Campfire", timeHours: 0.5, materials: { REFINED_UMBER: 1, MATCH_STICKS: 16 } },
  { name: "Tungsten Regulator", timeHours: 6, materials: { PERFECT_OPAL_GEMSTONE: 1, FUEL_TANK: 5, TUNGSTEN_PLATE: 5 } },
  { name: "Glacite-Plated Chisel", timeHours: 18, materials: { REINFORCED_CHISEL: 1, MITHRIL_PLATE: 1, GLACITE_AMALGAMATION: 8, BEJEWELED_HANDLE: 1 } },
  { name: "Perfect Chisel", timeHours: 24, materials: { GLACITE_PLATED_CHISEL: 1, PERFECT_PLATE: 1, BEJEWELED_HANDLE: 1 } },
  { name: "Pendant of Divan", timeHours: 168, materials: { SHATTERED_LOCKET: 1, PERFECT_PLATE: 1, DIVAN_FRAGMENT: 10 } },
  { name: "Relic of Power", timeHours: 8, materials: { ARTIFACT_OF_POWER: 1, PERFECT_PLATE: 4 } },
  { name: "Skeleton Key", timeHours: 0.5, materials: { BEJEWELED_HANDLE: 1, PERFECT_PLATE: 1 } },
];

// Strategie di acquisto/vendita
const STRATEGIES = {
  INSTANT_BUY_INSTANT_SELL: { name: 'Insta Buy / Insta Sell', buyMultiplier: 1.0, sellMultiplier: 1.0 },
  INSTANT_BUY_ASK_SELL: { name: 'Insta Buy / Ask Sell', buyMultiplier: 1.0, sellMultiplier: 0.95 },
  ASK_BUY_INSTANT_SELL: { name: 'Ask Buy / Insta Sell', buyMultiplier: 0.95, sellMultiplier: 1.0 },
  ASK_BUY_ASK_SELL: { name: 'Ask Buy / Ask Sell', buyMultiplier: 0.95, sellMultiplier: 0.95 },
};

function ForgeFlips({ bazaarPrices }) {
  const [numForges, setNumForges] = useState(1);
  const [strategy, setStrategy] = useState('INSTANT_BUY_INSTANT_SELL');
  const [sortBy, setSortBy] = useState('profitPerHour');
  const [sortOrder, setSortOrder] = useState('desc');
  const [forgeFlips, setForgeFlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Calcola il costo dei materiali per una ricetta
  const calculateMaterialCost = useCallback((materials, prices, selectedStrategy) => {
    let totalCost = 0;
    const strategyData = STRATEGIES[selectedStrategy];

    for (const [materialId, quantity] of Object.entries(materials)) {
      if (materialId === 'COINS') {
        totalCost += quantity;
        continue;
      }

      const priceData = prices[materialId];
      if (!priceData) {
        continue;
      }

      const buyPrice = priceData.quick_status?.buyPrice || 0;
      totalCost += buyPrice * quantity;
    }

    return totalCost;
  }, []);

  // Calcola il profitto per una ricetta
  const calculateProfit = useCallback((recipe, prices, selectedStrategy) => {
    const strategyData = STRATEGIES[selectedStrategy];
    const materialCost = calculateMaterialCost(recipe.materials, prices, selectedStrategy);
    
    // Usa la mappatura per ottenere l'ID corretto del bazaar
    const bazaarId = RECIPE_TO_BAZAAR_ID[recipe.name];
    const priceData = bazaarId ? prices[bazaarId] : null;
    
    if (!priceData || !priceData.quick_status) {
      return null;
    }

    const sellPrice = priceData.quick_status.sellPrice * strategyData.sellMultiplier;
    const profit = sellPrice - materialCost;
    const profitPerHour = profit / recipe.timeHours;
    const profitPerForge = profit;

    return {
      name: recipe.name,
      timeHours: recipe.timeHours,
      materialCost,
      sellPrice,
      profit,
      profitPerHour,
      profitPerForge,
      materials: recipe.materials,
      bazaarId,
    };
  }, [calculateMaterialCost]);

  // Calcola tutti i forge flips
  useEffect(() => {
    if (!bazaarPrices || Object.keys(bazaarPrices).length === 0) {
      console.log('[ForgeFlips] Nessun prezzo bazaar disponibile');
      setLoading(false);
      return;
    }

    console.log('[ForgeFlips] Prezzi bazaar caricati:', Object.keys(bazaarPrices).length, 'items');
    console.log('[ForgeFlips] Esempio keys:', Object.keys(bazaarPrices).slice(0, 10));

    try {
      const flips = [];
      const debugData = [];
      let totalRecipes = 0;
      let recipesWithPrice = 0;
      let profitableRecipes = 0;

      for (const recipe of FORGE_RECIPES) {
        totalRecipes++;
        const bazaarId = RECIPE_TO_BAZAAR_ID[recipe.name];
        const hasPrice = bazaarId && bazaarPrices[bazaarId];
        
        if (hasPrice) {
          recipesWithPrice++;
        }
        
        const profitData = calculateProfit(recipe, bazaarPrices, strategy);
        
        if (profitData) {
          debugData.push({
            name: recipe.name,
            bazaarId,
            hasPrice: true,
            materialCost: Math.round(profitData.materialCost),
            sellPrice: Math.round(profitData.sellPrice),
            profit: Math.round(profitData.profit),
            profitPerHour: Math.round(profitData.profitPerHour),
          });
          
          if (profitData.profit > 0) {
            profitableRecipes++;
            flips.push(profitData);
          }
        } else if (debugData.length < 20 && !hasPrice) {
          debugData.push({
            name: recipe.name,
            bazaarId,
            hasPrice: false,
            error: 'Nessun prezzo trovato',
          });
        }
      }

      console.log('[ForgeFlips] Totale ricette:', totalRecipes);
      console.log('[ForgeFlips] Ricette con prezzo:', recipesWithPrice);
      console.log('[ForgeFlips] Ricette profittevoli:', profitableRecipes);
      console.log('[ForgeFlips] Flips trovati:', flips.length);

      flips.sort((a, b) => {
        const multiplier = sortOrder === 'desc' ? 1 : -1;
        return (a[sortBy] - b[sortBy]) * multiplier;
      });

      setForgeFlips(flips);
      setDebugInfo({
        debugData,
        totalRecipes,
        recipesWithPrice,
        profitableRecipes,
        totalBazaarItems: Object.keys(bazaarPrices).length,
      });
      setError(null);
    } catch (err) {
      console.error('[ForgeFlips] Errore:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bazaarPrices, strategy, sortBy, sortOrder, calculateProfit]);

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  const formatCoins = (coins) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(coins));
  };

  if (loading) {
    return <div className="loading">Caricamento forge flips...</div>;
  }

  if (error) {
    return <div className="error">Errore: {error}</div>;
  }

  return (
    <div className="forge-flips">
      <h2>Forge Flips</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="numForges">Numero di Forge (1-8):</label>
          <input
            type="number"
            id="numForges"
            min="1"
            max="8"
            value={numForges}
            onChange={(e) => setNumForges(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>

        <div className="control-group">
          <label htmlFor="strategy">Strategia:</label>
          <select
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          >
            {Object.entries(STRATEGIES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sortBy">Ordina per:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="profitPerHour">Profitto/ora</option>
            <option value="profit">Profitto totale</option>
            <option value="profitPerForge">Profitto/forge</option>
            <option value="timeHours">Tempo di craft</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className="debug-info" style={{ background: '#222', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #444' }}>
          <h4 style={{ color: '#f0a500', margin: '0 0 15px 0', fontSize: '16px' }}>📊 Debug Info</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
            <div style={{ background: '#333', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Totale Bazaar Items</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{debugInfo.totalBazaarItems}</div>
            </div>
            <div style={{ background: '#333', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Ricette Totali</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{debugInfo.totalRecipes}</div>
            </div>
            <div style={{ background: '#333', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Ricette con Prezzo</div>
              <div style={{ color: '#4caf50', fontSize: '20px', fontWeight: 'bold' }}>{debugInfo.recipesWithPrice}</div>
            </div>
            <div style={{ background: '#333', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>Ricette Profittevoli</div>
              <div style={{ color: '#f0a500', fontSize: '20px', fontWeight: 'bold' }}>{debugInfo.profitableRecipes}</div>
            </div>
          </div>
          <h5 style={{ color: '#aaa', margin: '15px 0 10px 0', fontSize: '14px' }}>Dettagli primi items (max 20):</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto', background: '#111', padding: '10px', borderRadius: '4px', fontSize: '11px' }}>
            <pre style={{ color: '#ccc', margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(debugInfo.debugData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="forge-flips-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Tempo</th>
              <th>Costo Materiali</th>
              <th>Prezzo Vendita</th>
              <th>Profitto</th>
              <th>Profitto/Ora</th>
              <th>Profitto/Forge</th>
            </tr>
          </thead>
          <tbody>
            {forgeFlips.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  Nessun forge flip profittevole trovato con i prezzi attuali
                </td>
              </tr>
            ) : (
              forgeFlips.map((flip, index) => (
                <tr key={index} className={flip.profit > 0 ? 'profitable' : 'not-profitable'}>
                  <td className="item-name">{flip.name}</td>
                  <td>{formatTime(flip.timeHours)}</td>
                  <td>{formatCoins(flip.materialCost)}</td>
                  <td>{formatCoins(flip.sellPrice)}</td>
                  <td className="profit">{formatCoins(flip.profit)}</td>
                  <td className="profit-per-hour">{formatCoins(flip.profitPerHour)}</td>
                  <td className="profit-per-forge">{formatCoins(flip.profitPerForge)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <h3>Riepilogo con {numForges} forge(s)</h3>
        {forgeFlips.length > 0 && (
          <div className="stats">
            <p>
              <strong>Profitto totale/ora (tutte le forge):</strong>{' '}
              {formatCoins(forgeFlips.slice(0, numForges).reduce((sum, flip) => sum + flip.profitPerHour, 0))}
            </p>
            <p>
              <strong>Miglior flip:</strong> {forgeFlips[0].name} ({formatCoins(forgeFlips[0].profitPerHour)}/ora)
            </p>
            <p>
              <strong>Totale item profittevoli:</strong> {forgeFlips.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgeFlips;
