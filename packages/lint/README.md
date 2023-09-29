# lint

Defines the ESLint configs which are used by the packages in this repository.

## Notes

The dependencies for this package are installed at the root level. This allows the "extends" to resolve correctly. If this is dir A and you have dir B which uses a config from this directory, the "extends" modules will be resolved relative to dir B. So if the `node_modules` containing the dependencies (such as `eslint-config-airbnb-base`) are not in a parent of dir B, they will fail to resolve.

We would potentially swap to the new ESLint "flat config", but it is still experimental and a lot of things do not support it. We can revisit the lint structure in the future.
