import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const localesDir = join(__dirname, '../src');
const outputFile = join(__dirname, '../src/index.ts');

function getLanguageDirs(): string[] {
  return readdirSync(localesDir)
    .filter((file) => {
      const fullPath = join(localesDir, file);
      return statSync(fullPath).isDirectory() && !file.startsWith('.');
    })
    .sort();
}

function getJsonFiles(langDir: string): string[] {
  const fullPath = join(localesDir, langDir);
  return readdirSync(fullPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))
    .sort();
}

function generateIndexFile() {
  const languages = getLanguageDirs();

  if (languages.length === 0) {
    console.error('No language directories found in', localesDir);
    process.exit(1);
  }

  // Get all namespaces from the first language (assume all languages have same structure)
  const namespaces = getJsonFiles(languages[0]);

  if (namespaces.length === 0) {
    console.error('No JSON files found in', join(localesDir, languages[0]));
    process.exit(1);
  }

  // Generate imports
  const imports: string[] = [];
  languages.forEach((lang) => {
    namespaces.forEach((namespace) => {
      const varName = `${lang}${namespace.charAt(0).toUpperCase()}${namespace.slice(1)}`;
      imports.push(`import ${varName} from './${lang}/${namespace}.json';`);
    });
  });

  // Generate translations object
  const translationsObj: string[] = [];
  languages.forEach((lang) => {
    const namespaceEntries = namespaces
      .map((namespace) => {
        const varName = `${lang}${namespace.charAt(0).toUpperCase()}${namespace.slice(1)}`;
        return `    ${namespace}: ${varName}`;
      })
      .join(',\n');

    translationsObj.push(`  ${lang}: {\n${namespaceEntries},\n  }`);
  });

  // Generate the full file content
  const content = `// Auto-generated file - DO NOT EDIT MANUALLY
// Run 'pnpm generate:locales' to regenerate this file
// Generated on: ${new Date().toISOString()}

${imports.join('\n')}

export * from './types';

export const translations = {
${translationsObj.join(',\n')},
} as const;
`;

  writeFileSync(outputFile, content, 'utf-8');

  console.log('✅ Generated index.ts');
  console.log(`   Languages: ${languages.join(', ')}`);
  console.log(`   Namespaces: ${namespaces.join(', ')}`);
}

try {
  generateIndexFile();
} catch (error) {
  console.error('❌ Error generating locales:', error);
  process.exit(1);
}
