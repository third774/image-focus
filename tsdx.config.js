const images = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    return {
      ...config,
      plugins: [images({ include: ['**/*.svg'] }), ...config.plugins],
      output: {
        ...config.output,
        globals: {
          'image-focus': 'imageFocus',
        },
      },
    };
  },
};
