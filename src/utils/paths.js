import { dirname } from 'path';
import { fileURLToPath } from 'url';

// En ESM no existe __dirname por defecto; este helper lo reconstruye
// para el módulo que lo importe.
export const getDirname = (importMetaUrl) => dirname(fileURLToPath(importMetaUrl));
