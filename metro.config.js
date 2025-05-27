// Learn more https://docs.expo.io/guides/customizing-metro

const cfg = {
  resolver: {
    sourceExts: process.env.RN_SRC_EXT
      ? process.env.RN_SRC_EXT.split(',').concat([
          'js',
          'json',
          'jsx',
          'ts',
          'tsx',
        ])
      : ['js', 'json', 'jsx', 'ts', 'tsx'],
    assetExts: ['woff2', 'ttf', 'png', 'jpg', 'jpeg', 'svg', 'gif'],
    unstable_enablePackageExports: false,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
        nonInlinedRequires: [
          'React',
          'react',
          'react-compiler-runtime',
          'react/jsx-dev-runtime',
          'react/jsx-runtime',
          'react-native',
        ],
      },
    }),
  },
}

if (process.env.BSKY_PROFILE) {
  cfg.cacheVersion = (cfg.cacheVersion || '') + ':PROFILE'
}

cfg.resolver.resolveRequest = (context, moduleName, platform) => {
  // Custom resolution logic for specific packages
  if (moduleName.startsWith('multiformats/hashes/hasher')) {
    return context.resolveRequest(
      context,
      'multiformats/cjs/src/hashes/hasher',
      platform,
    )
  }
  if (moduleName.startsWith('multiformats/cid')) {
    return context.resolveRequest(context, 'multiformats/cjs/src/cid', platform)
  }
  if (moduleName === '@ipld/dag-cbor') {
    return context.resolveRequest(context, '@ipld/dag-cbor/src', platform)
  }
  if (process.env.BSKY_PROFILE) {
    if (moduleName.endsWith('ReactNativeRenderer-prod')) {
      return context.resolveRequest(
        context,
        moduleName.replace('-prod', '-profiling'),
        platform,
      )
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = cfg
