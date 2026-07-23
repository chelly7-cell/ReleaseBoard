import { Octokit } from "@octokit/rest";

export const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});


export async function getGithubReleases(
  owner: string,
  repo: string
) {

  const { data } =
    await github.rest.repos.listReleases({
      owner: owner.trim(),
      repo: repo.trim(),
    });


  return data;
}