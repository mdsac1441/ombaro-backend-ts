// src/lib/config.ts
import { TOML } from 'bun';
import { readFileSync } from 'fs';

interface ModuleConfig {
  service: {
    enabled: boolean;
    port: number;
    host: string
  };
  database: {
    postgres?: string;
    redis?: string;
    mongodb?: string;
  };
  [key: string]: any; // Additional custom configs
}

export const loadConfig = async (module: string): Promise<ModuleConfig> => {
  const configPaths = [
    `src/x/${module}/config.toml`, // TOML priority
    `src/x/${module}/config.json`,
    `src/x/${module}/config.yml`
  ];

  for (const path of configPaths) {
    try {
      const file = Bun.file(path);
      if (await file.exists()) {
        const text = await file.text();
        
        if (path.endsWith('.toml')) {
          return TOML.parse(text) as ModuleConfig;
        } else if (path.endsWith('.json')) {
          return JSON.parse(text);
        } else if (path.endsWith('.yml') || path.endsWith('.yaml')) {
          return require('yaml').parse(text);
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${path}:`, error);
    }
  }

  return {
    service: {
      enabled: false,
      port: 5000,
      host: 'localhost'
    },
    database: {}
  };
}

const configCache = new Map<string, ModuleConfig>();

export const getConfig = async (module: string): Promise<ModuleConfig> => {
  if (!configCache.has(module)) {
    configCache.set(module, await loadConfig(module));
  }
  return configCache.get(module)!;
}