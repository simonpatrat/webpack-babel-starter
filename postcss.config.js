module.exports = ({ options }) => {

    const { mode } = options;
    const cssnanoOptions = mode === 'production'
        ? {
            preset: 'default',
            autoprefixer: false,
            reduceIdents: false, // reduceIdents breaks animations sometimes
        }
        : false;
    return {
        plugins: {
            'postcss-preset-env': options['postcss-preset-env']
                ? options['postcss-preset-env']
                : false,
            cssnano: cssnanoOptions,
        },
    };
};
