import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const localesDir = join(__dirname, '../src');
const indexFile = join(__dirname, '../src/index.ts');
const typesFile = join(__dirname, '../src/types.ts');

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

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTypesFile(languages: string[], namespaces: string[]) {
  // Use first language as the type source (typically 'en')
  const baseLanguage = languages[0];

  // Generate imports from base language
  const imports = namespaces
    .map(
      (namespace) =>
        `import ${baseLanguage}${capitalize(namespace)} from './${baseLanguage}/${namespace}.json';`
    )
    .join('\n');

  // Generate type exports
  const typeExports = namespaces
    .map(
      (namespace) =>
        `export type ${capitalize(namespace)}Translations = typeof ${baseLanguage}${capitalize(namespace)};`
    )
    .join('\n');

  // Generate Locale type from available languages
  const localeType = `export type Locale = ${languages.map((lang) => `'${lang}'`).join(' | ')};`;

  const content = `// Auto-generated file - DO NOT EDIT MANUALLY
// Run 'pnpm generate:locales' to regenerate this file
// Generated on: ${new Date().toISOString()}

${imports}

${typeExports}

${localeType}

export type TranslationKey<T> = keyof T;
`;

  writeFileSync(typesFile, content, 'utf-8');
  console.log('✅ Generated types.ts');
}

function generateIndexFile(languages: string[], namespaces: string[]) {
  // Generate imports
  const imports: string[] = [];
  languages.forEach((lang) => {
    namespaces.forEach((namespace) => {
      const varName = `${lang}${capitalize(namespace)}`;
      imports.push(`import ${varName} from './${lang}/${namespace}.json';`);
    });
  });

  // Generate translations object
  const translationsObj: string[] = [];
  languages.forEach((lang) => {
    const namespaceEntries = namespaces
      .map((namespace) => {
        const varName = `${lang}${capitalize(namespace)}`;
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

  writeFileSync(indexFile, content, 'utf-8');
  console.log('✅ Generated index.ts');
}

function generateAll() {
  const languages = getLanguageDirs();

  if (languages.length === 0) {
    console.error('❌ No language directories found in', localesDir);
    process.exit(1);
  }

  // Get all namespaces from the first language (assume all languages have same structure)
  const namespaces = getJsonFiles(languages[0]);

  if (namespaces.length === 0) {
    console.error('❌ No JSON files found in', join(localesDir, languages[0]));
    process.exit(1);
  }

  // Generate both files
  generateTypesFile(languages, namespaces);
  generateIndexFile(languages, namespaces);

  console.log(`\n📦 Summary:`);
  console.log(`   Languages: ${languages.join(', ')}`);
  console.log(`   Namespaces: ${namespaces.join(', ')}`);
  console.log(`   Files: types.ts, index.ts`);
}

try {
  generateAll();
} catch (error) {
  console.error('❌ Error generating locales:', error);
  process.exit(1);
}
