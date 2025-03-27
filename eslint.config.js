import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  react: true,
  solid: true,
  rules: {
    'no-console': 'off',
    'solid/no-react-specific-props': 'off',
  },
})
