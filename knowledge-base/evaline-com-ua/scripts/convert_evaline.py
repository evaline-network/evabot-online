#!/usr/bin/env python3
"""
Evaline Multilingual Site to Markdown Converter
Crawls and converts all language versions of the company web presence:
- Ukrainian:  evaline.com.ua (43 pages)
- Russian:    evaline.com.ua/ru/ (67 pages)
- English:    eva-line.com (34 pages)
- Polish:     eva-line.pl (31 pages)
- German:     de.eva-line.com (1 page)
- Romanian:   ro.eva-line.com (1 page)

Total: 177 pages.
Processes HTML, resolves PageSpeed lazy-loading, extracts rich YAML frontmatter,
rewrites internal links to relative .md files, and produces a complete multilingual index.
"""

import os
import re
import sys
import time
import json
import urllib.parse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bs4 import BeautifulSoup
import html2text
import yaml

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = WORKSPACE_DIR / "site"
ASSETS_DIR = OUTPUT_DIR / "assets" / "images"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X-UA-Compatible; Modern Markdown Crawler; "
        "+https://evaline.com.ua)"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "uk-UA,uk;q=0.9,en-US,en;q=0.8,pl;q=0.7,de;q=0.6,ro;q=0.5,ru;q=0.4",
}

# Session with retry mechanism
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(max_retries=3)
session.mount("http://", adapter)
session.mount("https://", adapter)
session.headers.update(HEADERS)

LANGUAGE_CONFIG = {
    "uk": {"name": "Ukrainian", "flag": "🇺🇦", "domain": "evaline.com.ua"},
    "ru": {"name": "Russian", "flag": "🌐", "domain": "evaline.com.ua/ru"},
    "en": {"name": "English", "flag": "🇬🇧", "domain": "eva-line.com"},
    "pl": {"name": "Polish", "flag": "🇵🇱", "domain": "eva-line.pl"},
    "de": {"name": "German", "flag": "🇩🇪", "domain": "de.eva-line.com"},
    "ro": {"name": "Romanian", "flag": "🇷🇴", "domain": "ro.eva-line.com"},
}


def fetch_url(url: str, timeout: int = 25) -> str:
    """Fetch URL with timeout and fallback."""
    resp = session.get(url, timeout=timeout)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding or "utf-8"
    return resp.text


def collect_all_urls() -> list[dict]:
    """Collect URLs from all language sitemaps and landing pages."""
    all_urls = []
    seen = set()

    # 1. evaline.com.ua sitemap (UK and RU)
    print("Fetching evaline.com.ua sitemap...")
    try:
        xml_text = fetch_url("https://evaline.com.ua/sitemap.xml")
        soup = BeautifulSoup(xml_text, "xml")
        for tag in soup.find_all("url"):
            loc = tag.find("loc")
            if not loc:
                continue
            u = loc.text.strip()
            if not u or u in seen:
                continue
            seen.add(u)
            lastmod = tag.find("lastmod")
            all_urls.append({
                "url": u,
                "site": "evaline.com.ua",
                "lastmod": lastmod.text.strip() if lastmod else "",
            })
    except Exception as e:
        print(f"Error fetching evaline.com.ua sitemap: {e}")

    # 2. eva-line.com sitemap (EN)
    print("Fetching eva-line.com sitemap...")
    try:
        xml_text = fetch_url("https://eva-line.com/sitemap.xml")
        soup = BeautifulSoup(xml_text, "xml")
        for tag in soup.find_all("url"):
            loc = tag.find("loc")
            if not loc:
                continue
            u = loc.text.strip()
            if not u or u in seen:
                continue
            seen.add(u)
            lastmod = tag.find("lastmod")
            all_urls.append({
                "url": u,
                "site": "eva-line.com",
                "lastmod": lastmod.text.strip() if lastmod else "",
            })
    except Exception as e:
        print(f"Error fetching eva-line.com sitemap: {e}")

    # 3. eva-line.pl sitemap (PL)
    print("Fetching eva-line.pl sitemap...")
    try:
        xml_text = fetch_url("https://eva-line.pl/sitemap.xml")
        soup = BeautifulSoup(xml_text, "xml")
        for tag in soup.find_all("url"):
            loc = tag.find("loc")
            if not loc:
                continue
            u = loc.text.strip()
            if not u or u in seen:
                continue
            seen.add(u)
            lastmod = tag.find("lastmod")
            all_urls.append({
                "url": u,
                "site": "eva-line.pl",
                "lastmod": lastmod.text.strip() if lastmod else "",
            })
    except Exception as e:
        print(f"Error fetching eva-line.pl sitemap: {e}")

    # 4. de.eva-line.com (DE)
    de_url = "https://de.eva-line.com/"
    if de_url not in seen:
        seen.add(de_url)
        all_urls.append({"url": de_url, "site": "de.eva-line.com", "lastmod": ""})

    # 5. ro.eva-line.com (RO)
    ro_url = "https://ro.eva-line.com/"
    if ro_url not in seen:
        seen.add(ro_url)
        all_urls.append({"url": ro_url, "site": "ro.eva-line.com", "lastmod": ""})

    print(f"Total discovered URLs across all language editions: {len(all_urls)}")
    return all_urls


def url_to_relative_md_path(url: str) -> tuple[str, str, Path]:
    """
    Map URL to language code, category, and target Markdown relative path within OUTPUT_DIR.
    Returns: (lang, category, rel_path)
    """
    parsed = urllib.parse.urlparse(url)
    netloc = parsed.netloc.lower()
    path = parsed.path.strip("/")

    # Determine language
    if netloc == "eva-line.com":
        lang = "en"
        subpath = path
    elif netloc == "eva-line.pl":
        lang = "pl"
        subpath = path
    elif netloc == "de.eva-line.com":
        lang = "de"
        subpath = path
    elif netloc == "ro.eva-line.com":
        lang = "ro"
        subpath = path
    else:
        # evaline.com.ua
        if path == "ru" or path == "ru/" or path.startswith("ru/"):
            lang = "ru"
            subpath = path[3:]
        else:
            lang = "uk"
            subpath = path

    # Clean homepage
    if not subpath or subpath == "index.html" or subpath == "index":
        return lang, "home", Path(f"{lang}/index.md")

    # Clean up weird paths like novini.html/tatamy.html or news.html/tatami.html
    subpath = re.sub(r"^(novini|news)\.html/", r"\1/", subpath)
    subpath = re.sub(r"^news\.html$", "news/index.html", subpath)
    subpath = re.sub(r"^novini\.html$", "novini/index.html", subpath)

    # Strip .html extension
    if subpath.endswith(".html"):
        stem = subpath[:-5]
    else:
        stem = subpath

    parts = [p for p in stem.split("/") if p]
    if not parts:
        return lang, "home", Path(f"{lang}/index.md")

    if len(parts) == 1:
        category = "general"
        rel_path = Path(f"{lang}/{parts[0]}.md")
    else:
        category = parts[0]
        rel_path = Path(f"{lang}/{'/'.join(parts)}.md")

    return lang, category, rel_path


def clean_and_extract_metadata(soup: BeautifulSoup, original_url: str, lastmod: str, lang: str, category: str) -> dict:
    """Extract metadata (title, description, canonical, images)."""
    meta = {}

    title = ""
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title["content"].strip()
    elif soup.title and soup.title.string:
        title = soup.title.string.strip()
    meta["title"] = title

    desc = ""
    meta_desc = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", property="og:description")
    if meta_desc and meta_desc.get("content"):
        desc = meta_desc["content"].strip()
    meta["description"] = desc

    meta["url"] = original_url
    if lastmod:
        meta["lastmod"] = lastmod

    meta["language"] = lang
    meta["language_name"] = LANGUAGE_CONFIG.get(lang, {}).get("name", lang)
    meta["category"] = category

    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        img_url = og_img["content"].strip()
        if not img_url.startswith("http"):
            img_url = urllib.parse.urljoin(original_url, img_url)
        meta["og_image"] = img_url

    return meta


def process_html_content(raw_html: str, original_url: str, url_map: dict[str, Path], current_rel_path: Path) -> tuple[BeautifulSoup, str]:
    """
    Process raw HTML, sanitize DOM, fix PageSpeed lazy loading,
    rewrite links to Markdown relative paths, and convert to Markdown.
    """
    soup = BeautifulSoup(raw_html, "html.parser")
    base_tag = soup.find("base")
    base_url = base_tag["href"] if (base_tag and base_tag.get("href")) else original_url

    # 1. Resolve PageSpeed lazy-loaded images & absolute image paths
    for img in soup.find_all("img"):
        real_src = (
            img.get("data-pagespeed-lazy-src")
            or img.get("data-src")
            or img.get("src")
            or ""
        )
        if "1.JiBnMqyl6S.gif" in real_src or not real_src:
            real_src = img.get("data-pagespeed-lazy-src") or img.get("data-src") or ""

        if real_src:
            abs_img_url = urllib.parse.urljoin(base_url, real_src)
            img["src"] = abs_img_url

        for attr in ["data-pagespeed-lazy-src", "data-pagespeed-lazy-position", "onload", "onerror"]:
            if img.has_attr(attr):
                del img[attr]

    # 2. Rewrite internal links to relative .md paths
    for a in soup.find_all("a"):
        href = a.get("href")
        if not href or href.startswith(("tel:", "mailto:", "javascript:", "#")):
            continue

        abs_href = urllib.parse.urljoin(base_url, href)
        norm_href = abs_href.split("#")[0].split("?")[0]
        if norm_href in url_map:
            target_rel = url_map[norm_href]
            # Compute relative path from current_rel_path's parent to target_rel
            try:
                rel_to_target = os.path.relpath(target_rel, current_rel_path.parent)
                a["href"] = rel_to_target
            except ValueError:
                a["href"] = target_rel.as_posix()

    # 3. Locate Main Content Container
    main_el = soup.find("div", class_="main") or soup.find("main") or soup.find("body")
    if not main_el:
        main_el = soup

    main_soup = BeautifulSoup(str(main_el), "html.parser")

    # 4. Remove unneeded clutter & boilerplate inside main content
    unwanted_selectors = [
        "script", "style", "noscript", "iframe",
        ".menu-togle", ".modal", "#uk-form-feedback", "#form-cooperation",
        "form", ".ajax_form", ".search-wrapper",
        "input", "button"
    ]
    for sel in unwanted_selectors:
        for el in main_soup.select(sel):
            el.decompose()

    # 5. Format consultation blocks cleanly
    for sotr in main_soup.find_all("div", class_="sotr-bl"):
        sotr.insert_before(main_soup.new_tag("hr"))
        sotr.insert_after(main_soup.new_tag("hr"))

    # 6. HTML to Markdown Conversion
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.ignore_tables = False
    h.body_width = 0
    h.single_line_break = False
    h.mark_code = True
    h.unicode_snob = True
    h.protect_links = True

    md_content = h.handle(str(main_soup))

    # Clean up excessive newlines
    md_content = re.sub(r"\n{4,}", "\n\n\n", md_content).strip()
    # Remove leftover placeholder gifs
    md_content = re.sub(r"!\[.*?\]\(.*?1\.JiBnMqyl6S\.gif.*?\)", "", md_content)

    return soup, md_content


def convert_single_page(url_info: dict, url_map: dict[str, Path]) -> dict:
    """Fetch and convert a single page to Markdown."""
    url = url_info["url"]
    lastmod = url_info.get("lastmod", "")

    lang, category, rel_path = url_to_relative_md_path(url)
    target_path = OUTPUT_DIR / rel_path
    target_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        raw_html = fetch_url(url)
        soup, md_body = process_html_content(raw_html, url, url_map, rel_path)
        meta = clean_and_extract_metadata(soup, url, lastmod, lang, category)
        meta["file"] = str(rel_path)

        frontmatter_str = yaml.dump(meta, sort_keys=False, allow_unicode=True).strip()
        full_md = f"---\n{frontmatter_str}\n---\n\n{md_body}\n"

        target_path.write_text(full_md, encoding="utf-8")

        return {
            "status": "success",
            "url": url,
            "title": meta.get("title", ""),
            "lang": lang,
            "category": category,
            "rel_path": str(rel_path),
            "size": len(full_md),
            "lines": full_md.count("\n"),
        }
    except Exception as e:
        print(f"[ERROR] Failed {url}: {e}")
        return {
            "status": "error",
            "url": url,
            "error": str(e),
            "rel_path": str(rel_path),
        }


def generate_multilingual_summary(results: list[dict]):
    """Generate master SUMMARY.md across all languages."""
    success_pages = [r for r in results if r.get("status") == "success"]

    lines = [
        "# Evaline Global - Markdown Documentation Index\n",
        "> Complete multilingual website archive converted to Markdown with structured metadata, media links, and cross-navigation.\n",
        f"- **Total Converted Pages:** {len(success_pages)}",
        f"- **Timestamp:** {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n",
        "## Language Editions Overview\n",
    ]

    for lang_code, cfg in LANGUAGE_CONFIG.items():
        lang_pages = [p for p in success_pages if p.get("lang") == lang_code]
        lines.append(f"- {cfg['flag']} **{cfg['name']}** (`site/{lang_code}/`): {len(lang_pages)} pages ({cfg['domain']})")

    lines.append("\n---\n")

    for lang_code, cfg in LANGUAGE_CONFIG.items():
        lang_pages = [p for p in success_pages if p.get("lang") == lang_code]
        if not lang_pages:
            continue

        lines.append(f"\n## {cfg['flag']} {cfg['name']} Section (`site/{lang_code}/`)\n")
        lang_pages.sort(key=lambda x: (x["category"], x["title"]))

        current_cat = None
        for p in lang_pages:
            cat = p["category"].upper()
            if cat != current_cat:
                current_cat = cat
                lines.append(f"\n### {cat}\n")
            title = p["title"] or Path(p["rel_path"]).stem
            link_target = Path(p["rel_path"]).as_posix()
            lines.append(f"- [{title}]({link_target})")

    summary_path = OUTPUT_DIR / "SUMMARY.md"
    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated master multilingual summary at {summary_path}")


def main():
    print("=== Evaline Multilingual Site to Markdown Converter ===")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    urls_info = collect_all_urls()

    url_map = {}
    for item in urls_info:
        u = item["url"]
        _, _, rel_path = url_to_relative_md_path(u)
        norm = u.split("#")[0].split("?")[0]
        url_map[norm] = rel_path
        if norm.endswith("/"):
            url_map[norm[:-1]] = rel_path
        else:
            url_map[norm + "/"] = rel_path

    print(f"Precomputed URL mappings for {len(url_map)} variants.")

    results = []
    max_workers = 8
    print(f"Starting concurrent conversion with {max_workers} threads...")

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(convert_single_page, u, url_map): u for u in urls_info}
        completed = 0
        total = len(futures)
        for future in as_completed(futures):
            res = future.result()
            results.append(res)
            completed += 1
            status_symbol = "✓" if res["status"] == "success" else "✗"
            print(f"[{completed}/{total}] {status_symbol} ({res.get('lang', '?')}) {res['url']} -> {res.get('rel_path', '')}")

    generate_multilingual_summary(results)

    stats_file = OUTPUT_DIR / "conversion_stats.json"
    with open(stats_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    successes = [r for r in results if r["status"] == "success"]
    failures = [r for r in results if r["status"] == "error"]

    print("\n=== Global Conversion Summary ===")
    print(f"Total processed: {len(results)}")
    print(f"Successful:      {len(successes)}")
    print(f"Failed:          {len(failures)}")
    for lang, cfg in LANGUAGE_CONFIG.items():
        cnt = len([r for r in successes if r.get("lang") == lang])
        print(f" - {cfg['flag']} {cfg['name']} ({lang}): {cnt} pages")

    if failures:
        print("\nFailures:")
        for f in failures:
            print(f" - {f['url']}: {f.get('error')}")


if __name__ == "__main__":
    main()
