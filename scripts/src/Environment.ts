export enum Environment {
  Staging = "staging",
  Production = "production",
}

export function getEnvironment(): Environment {
  const env = process.env.environment;

  if (env && env === Environment.Production) {
    return Environment.Production;
  }

  return Environment.Staging;
}
