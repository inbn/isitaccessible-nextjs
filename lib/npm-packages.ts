export interface Package {
  package: {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: {
      npm: string;
      homepage?: string;
      repository?: string;
      bugs?: string;
    };
    publisher: {
      username: string;
      email: string;
    };
    maintainers: {
      username: string;
      email: string;
    }[];
  };
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  searchScore: number;
}

const sortSuggestions = (packageA: Package, packageB: Package) => {
  // Rank closely matching packages followed
  // by most popular ones
  if (
    Math.abs(Math.log(packageB.searchScore) - Math.log(packageA.searchScore)) >
    1
  ) {
    return packageB.searchScore - packageA.searchScore;
  } else {
    return packageB.score.detail.popularity - packageA.score.detail.popularity;
  }
};

export const getSuggestions = async (query: string) => {
  if (!query) {
    return [];
  }

  const response = await fetch(
    `https://api.npms.io/v2/search/suggestions?q=${query}`
  );

  const data = await response.json();
  return data.sort(sortSuggestions);
};
