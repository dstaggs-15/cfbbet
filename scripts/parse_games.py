#!/usr/bin/env python3
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
PUBLIC = ROOT / "public"
PUBLIC.mkdir(exist_ok=True, parents=True)

GAMES_TXT = DATA / "games.txt"
TEAMS_JSON = DATA / "teams.json"
OUT_JSON = PUBLIC / "games.json"

LINE_RE = re.compile(
    r"^\s*(?P<team1>.+?)\s+vs\.\s+(?P<team2>.+?)\s*\(\s*(?P<spread>[+-]?\d+(?:\.\d+)?)\s*,\s*(?P<ou>\d+(?:\.\d+)?)\s*\)\s*$"
)

def load_colors():
    with open(TEAMS_JSON, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_line(line, colors):
    m = LINE_RE.match(line.strip())
    if not m:
        return None
    team1 = m.group("team1").strip()
    team2 = m.group("team2").strip()
    spread = float(m.group("spread"))
    ou = float(m.group("ou"))

    def c(team, fallback_primary="#222", fallback_secondary="#ddd"):
        return colors.get(team, {"primary": fallback_primary, "secondary": fallback_secondary})

    return {
        "team1": team1,
        "team2": team2,
        "spread_team1": spread,
        "spread_team2": -spread,
        "over_under": ou,
        "team1_colors": c(team1),
        "team2_colors": c(team2)
    }

def main():
    colors = load_colors()
    games = []
    bad = []
    for i, line in enumerate(open(GAMES_TXT, encoding="utf-8"), start=1):
        s = line.strip()
        if not s:
            continue
        g = parse_line(s, colors)
        if g:
            games.append(g)
        else:
            bad.append((i, s))
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2)
    print(f"Wrote {len(games)} games to {OUT_JSON}")
    if bad:
        print("\nThe following lines failed to parse (line#: text):")
        for ln, txt in bad:
            print(f"  {ln}: {txt}")
        sys.exit(1)

if __name__ == "__main__":
    main()
