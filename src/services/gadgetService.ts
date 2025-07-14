import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
  starWars,
  Config,
} from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";

export class GadgetService {
  // Generate a unique codename for gadgets
  static generateCodename(): string {
    const config: Config = {
      dictionaries: [adjectives, colors, animals],
      separator: " ",
      style: "capital",
      length: 3,
    };

    const baseName = uniqueNamesGenerator(config);
    const prefix = "The";

    return `${prefix} ${baseName}`;
  }

  // Generate alternative codenames using different dictionaries
  static generateAlternativeCodename(): string {
    const themes = [
      // Spy/Secret Agent theme
      {
        dictionaries: [
          [
            "Stealth",
            "Shadow",
            "Phantom",
            "Ghost",
            "Viper",
            "Falcon",
            "Eagle",
            "Raven",
            "Wolf",
            "Panther",
          ],
          [
            "Strike",
            "Blade",
            "Fury",
            "Storm",
            "Lightning",
            "Thunder",
            "Fire",
            "Ice",
            "Steel",
            "Diamond",
          ],
          [
            "Protocol",
            "Directive",
            "Operation",
            "Mission",
            "Code",
            "Cipher",
            "Signal",
            "Vector",
            "Matrix",
            "Nexus",
          ],
        ],
      },
      // Mythological theme
      {
        dictionaries: [
          [
            "Titan",
            "Phoenix",
            "Dragon",
            "Kraken",
            "Hydra",
            "Griffin",
            "Chimera",
            "Cerberus",
            "Pegasus",
            "Sphinx",
          ],
          [
            "Prime",
            "Elite",
            "Supreme",
            "Ultra",
            "Mega",
            "Hyper",
            "Alpha",
            "Beta",
            "Gamma",
            "Delta",
          ],
          [
            "Guardian",
            "Sentinel",
            "Defender",
            "Protector",
            "Warden",
            "Shield",
            "Armor",
            "Fortress",
            "Bastion",
            "Citadel",
          ],
        ],
      },
      // Tech/Sci-fi theme
      {
        dictionaries: [
          [
            "Quantum",
            "Neural",
            "Digital",
            "Cyber",
            "Nano",
            "Plasma",
            "Photon",
            "Electron",
            "Proton",
            "Neutron",
          ],
          [
            "Core",
            "Matrix",
            "Array",
            "Grid",
            "Network",
            "System",
            "Engine",
            "Drive",
            "Processor",
            "Circuit",
          ],
          [
            "Interface",
            "Protocol",
            "Algorithm",
            "Database",
            "Framework",
            "Platform",
            "Module",
            "Component",
            "Device",
            "Tool",
          ],
        ],
      },
    ];

    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

    const config: Config = {
      dictionaries: selectedTheme.dictionaries,
      separator: " ",
      style: "capital",
      length: 2,
    };

    const baseName = uniqueNamesGenerator(config);
    return `The ${baseName}`;
  }

  // Generate mission success probability (random percentage)
  static generateMissionSuccessProbability(): number {
    // Generate a realistic probability between 45% and 98%
    // Most gadgets should have high success rates, but not perfect
    const min = 45;
    const max = 98;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate a random confirmation code for self-destruct
  static generateSelfDestructCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;
    let code = "";

    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Format as XXXX-XXXX for better readability
    return `${code.slice(0, 4)}-${code.slice(4)}`;
  }

  // Validate if a gadget can be self-destructed
  static canSelfDestruct(status: string): boolean {
    // Only available and deployed gadgets can be self-destructed
    return ["Available", "Deployed"].includes(status);
  }

  // Get random gadget description based on codename
  static generateDescription(codename: string): string {
    const descriptions = [
      `${codename} is a state-of-the-art surveillance device with quantum encryption capabilities.`,
      `${codename} features advanced stealth technology and multi-spectrum camouflage systems.`,
      `${codename} is equipped with neural interface technology for seamless agent integration.`,
      `${codename} incorporates cutting-edge biometric authentication and self-defense mechanisms.`,
      `${codename} utilizes nano-scale components for maximum portability and effectiveness.`,
      `${codename} combines artificial intelligence with traditional espionage tools for optimal mission success.`,
      `${codename} features electromagnetic pulse resistance and tactical communication arrays.`,
      `${codename} is designed for extreme environments with adaptive camouflage capabilities.`,
      `${codename} includes holographic projection technology and voice modulation systems.`,
      `${codename} integrates satellite uplink capabilities with real-time data analysis tools.`,
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}
