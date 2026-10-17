import { companionRelease } from "@/lib/companion/downloads";

export type CompanionReleaseAssets = {
  version: string;
  tag: string;
  windowsExeUrl: string | null;
  windowsZipUrl: string | null;
  macDmgUrl: string | null;
  macZipUrl: string | null;
  linuxAppImageUrl: string | null;
  linuxDebUrl: string | null;
  releasesPageUrl: string;
};

type GitHubAsset = { name: string; browser_download_url: string };

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  assets: GitHubAsset[];
};

function pickAsset(assets: GitHubAsset[], pattern: RegExp) {
  return assets.find((a) => pattern.test(a.name))?.browser_download_url ?? null;
}

export async function fetchCompanionReleaseAssets(): Promise<CompanionReleaseAssets | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${companionRelease.repo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Drawsy-Landing-Companion",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GitHubRelease;
    const tag = data.tag_name;
    const version = tag.replace(/^v/i, "");

    return {
      version,
      tag,
      windowsExeUrl: pickAsset(data.assets, /win-x64.*\.exe$/i),
      windowsZipUrl: pickAsset(data.assets, /win-x64.*\.zip$/i),
      macDmgUrl: pickAsset(data.assets, /arm64\.dmg$/i),
      macZipUrl: pickAsset(data.assets, /arm64-mac\.zip$/i),
      linuxAppImageUrl: pickAsset(data.assets, /\.AppImage$/i),
      linuxDebUrl: pickAsset(data.assets, /amd64\.deb$/i),
      releasesPageUrl: data.html_url || companionRelease.releasesUrl,
    };
  } catch {
    return null;
  }
}
