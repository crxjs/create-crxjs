import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: false,
  vue: true,
  react: true,
  solid: true,
  svelte: true,
  rules: {
    'no-console': 'off',
    'solid/no-react-specific-props': 'off',
  },
})
