# docker-entrypoint

- yarn plugin "workspace-tools" was added so we can install only production dependencies for this package for the docker build by using `yarn workspaces focus --production`

## Hoisting

Note that the following section was added so that this package does not get hoisted when building in the Dockerfile.

It could be updated such that this only gets inserted into the package.json for the docker build, but this has not been done yet. It is not a huge priority, but it can be done at some point.

```json
{
  "installConfig": {
    "hoistingLimits": "workspaces"
  }
}
```
