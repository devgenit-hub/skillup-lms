import baseConfig from '@repo/eslint-config/next.js';

export default [
  ...baseConfig,
  {
    rules: {
      // Disable prop-types for TypeScript projects
      'react/prop-types': 'off',
      // Allow img elements for dynamic external URLs
      '@next/next/no-img-element': 'off',
      // Disable exhaustive-deps to allow manual dependency management
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
