# @repo/locales

Shared localization package for the monorepo with **automated generation** of translation imports.

## Structure

```
packages/locales/
├── scripts/
│   └── generate.ts          # Auto-generates index.ts
├── src/
│   ├── en/
│   │   ├── website.json
│   │   ├── dashboard.json
│   │   └── common.json
│   ├── bn/
│   │   ├── website.json
│   │   ├── dashboard.json
│   │   └── common.json
│   ├── types.ts
│   └── index.ts             # Auto-generated - DO NOT EDIT
├── package.json
└── tsconfig.json
```

## Usage

### In Website App

```tsx
'use client';

import { useLocale } from '../../providers/locale-provider';

export default function Page() {
  const { t, c } = useLocale();
  const pageText = t('homepage');
  const states = c('states');

  return (
    <div>
      <h1>{pageText['welcome']}</h1>
      <button>{pageText['subscribe']}</button>
      <p>{states['loading']}</p>
    </div>
  );
}
```

### In Dashboard App

```tsx
'use client';

import { useLocale } from '../../providers/locale-provider';

export default function Page() {
  const { t, c } = useLocale();
  const pageText = t('homepage');
  const buttons = t('buttons');
  const states = c('states');

  return (
    <div>
      <h1>{pageText['welcome']}</h1>
      <button>{buttons['add']}</button>
      <p>{states['success']}</p>
    </div>
  );
}
```

## Translation Structure (Namespaced)

All translations use **nested objects by namespace** with **bracket notation** access:

### App-specific (website.json / dashboard.json)

```json
{
  "homepage": {
    "welcome": "Welcome to our platform",
    "subscribe": "Subscribe"
  },
  "navbar": {
    "home": "Home",
    "courses": "Courses"
  }
}
```

### Common translations (common.json)

```json
{
  "states": {
    "loading": "Loading...",
    "error": "Something went wrong"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### Access Pattern

- ✅ `const pageText = t('homepage')` → Get namespace
- ✅ `pageText['welcome']` → Access with bracket notation
- ✅ `const states = c('states')` → Common namespace
- ✅ `states['loading']` → Access common text

## Supported Locales

- `en` - English (default)
- `bn` - Bengali (বাংলা)

## Adding New Languages

1. **Create new language directory**: `packages/locales/src/[locale]/`
2. **Add JSON files**: Create `website.json`, `dashboard.json`, `common.json` with same structure
3. **Regenerate index.ts**: Run `pnpm generate` in the locales package
4. **Done!** The new language is automatically available

```bash
# Example: Adding French (fr)
mkdir packages/locales/src/fr
# Copy and translate JSON files
cp packages/locales/src/en/*.json packages/locales/src/fr/
# Regenerate
cd packages/locales && pnpm generate
```

## Adding New Namespaces

1. **Add to all language files**: Add the new namespace object to each language's JSON files
2. **Regenerate**: Run `pnpm generate` to update imports
3. **Use immediately**: `const myNamespace = t('myNewNamespace')`

## Development

```bash
# Regenerate index.ts after adding/modifying languages
cd packages/locales
pnpm generate
```

**Note**: Never manually edit `src/index.ts` - it's auto-generated!
