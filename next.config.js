/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // eslint isn't in package.json here, so this is mostly a no-op safety
    // net — but if you later add eslint yourself, this keeps lint issues
    // from blocking a deploy while you're iterating.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
