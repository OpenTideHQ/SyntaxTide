"""
Splunk SPL Reference Documentation Crawler

This crawler extracts documentation from the Splunk SPL Reference site
and converts it into well-structured markdown files.
"""

import asyncio
import re
import json
from pathlib import Path
from typing import List, Dict, Set
from urllib.parse import urljoin, urlparse
import concurrent.futures

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from loguru import logger
import html2text
from markdownify import markdownify as md


# Configure loguru with rich formatting
logger.remove()
logger.add(
    lambda msg: print(msg, end=""),
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
)


class SplunkDocCrawler:
    """Crawls and converts Splunk SPL documentation to markdown"""
    
    def __init__(self, output_dir: str = "../documentation"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.processed_urls: Set[str] = set()
        self.html_converter = html2text.HTML2Text()
        self.html_converter.ignore_links = False
        self.html_converter.ignore_images = False
        self.html_converter.body_width = 0  # Don't wrap lines
        
        logger.info("🌊 Initializing Splunk Documentation Crawler")
        
    def _create_driver(self) -> webdriver.Chrome:
        """Create a Chrome WebDriver instance"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        return webdriver.Chrome(options=chrome_options)
    
    def _sanitize_filename(self, name: str) -> str:
        """Convert a page title to a valid filename"""
        # Remove or replace invalid characters
        name = re.sub(r'[<>:"/\\|?*]', '-', name)
        # Replace multiple spaces/dashes with single dash
        name = re.sub(r'[\s\-]+', '-', name)
        # Remove leading/trailing dashes
        name = name.strip('-')
        # Lowercase and limit length
        name = name.lower()[:100]
        return name if name else "index"
    
    def _extract_section_name(self, url: str, title: str) -> str:
        """Extract section name from URL or title"""
        # Try to get from URL path
        parsed = urlparse(url)
        path_parts = [p for p in parsed.path.split('/') if p]
        
        # Look for the section name in the path
        if len(path_parts) >= 2:
            section = path_parts[-2]
            return self._sanitize_filename(section)
        
        # Fallback to sanitized title
        return self._sanitize_filename(title)
    
    def _get_sidebar_links(self, driver: webdriver.Chrome, section_url: str) -> List[Dict[str, str]]:
        """Extract all page links from the page body"""
        logger.info(f"📋 Extracting section links from page")
        
        try:
            # Wait a bit for dynamic content to load
            import time
            time.sleep(2)
            
            # Just scan all links in the body - no need to find specific sidebar
            body = driver.find_element(By.TAG_NAME, "body")
            
            # Extract section identifier from the URL
            # e.g., from ".../10.0/introduction/..." extract "introduction"
            section_url_parsed = urlparse(section_url)
            section_path_parts = [p for p in section_url_parsed.path.split('/') if p]
            
            # Find the section identifier (should be after "10.0")
            section_identifier = None
            for i, part in enumerate(section_path_parts):
                if part == "10.0" and i + 1 < len(section_path_parts):
                    section_identifier = section_path_parts[i + 1]
                    break
            
            logger.debug(f"Section identifier: {section_identifier}")
            
            # Extract all links from body - get hrefs first to avoid stale element errors
            links = body.find_elements(By.TAG_NAME, "a")
            logger.debug(f"Found {len(links)} total links on page")
            
            # First pass: extract all href and text attributes to avoid stale element issues
            # Use JavaScript to avoid stale element problems
            link_data = []
            for i, link in enumerate(links):
                try:
                    # Use JavaScript to get attributes to avoid stale element issues
                    href = driver.execute_script("return arguments[0].href;", link)
                    text = driver.execute_script("return arguments[0].textContent;", link)
                    if href and text:
                        text = text.strip()
                        if text:
                            link_data.append({"href": href, "text": text})
                except Exception as e:
                    # Silently skip problematic links
                    continue
            
            logger.debug(f"Extracted {len(link_data)} raw links from page")
            
            # Second pass: process the extracted data
            pages = []
            seen_urls = set()
            
            for link_info in link_data:
                try:
                    href = link_info["href"]
                    text = link_info["text"]
                    
                    # Make absolute URL
                    full_url = urljoin(section_url, href)
                    
                    # Strip anchor tags to avoid duplicates (anchors are sections within same page)
                    full_url_no_anchor = full_url.split('#')[0]
                    
                    # Filter out external links
                    if not full_url_no_anchor.startswith("https://help.splunk.com"):
                        continue
                    
                    # Filter duplicates (by URL without anchor)
                    if full_url_no_anchor in seen_urls:
                        continue
                    
                    # CRITICAL: Only include links that belong to this section
                    # Must be in the same SPL reference manual (10.0) and same section
                    full_url_parsed = urlparse(full_url_no_anchor)
                    
                    # Must contain "/10.0/" to be in the SPL reference manual
                    if "/10.0/" not in full_url_parsed.path:
                        continue
                    
                    # Check if the URL contains the section identifier
                    if section_identifier:
                        if f"/{section_identifier}/" not in full_url_parsed.path:
                            continue
                    
                    # Extract filename from URL path for naming
                    url_path = urlparse(full_url_no_anchor).path
                    page_filename = url_path.rstrip('/').split('/')[-1]
                    
                    pages.append({
                        "title": text,
                        "url": full_url_no_anchor,
                        "filename": page_filename
                    })
                    seen_urls.add(full_url_no_anchor)
                    logger.debug(f"Added page: {text} ({page_filename})")
                        
                except Exception as e:
                    logger.debug(f"Error processing link: {e}")
                    continue
            
            logger.success(f"✨ Found {len(pages)} pages in sidebar")
            logger.info(f"📊 Sample URLs: {[p['url'] for p in pages[:5]]}")  # Show first 5 URLs for debugging
            return pages
            
        except Exception as e:
            logger.error(f"❌ Error extracting sidebar links: {e}")
            return []
    
    def _extract_main_content(self, driver: webdriver.Chrome) -> str:
        """Extract the main documentation content and convert to markdown"""
        try:
            logger.debug("🔍 Searching for main content area...")
            # Wait for content to load
            wait = WebDriverWait(driver, 10)
            
            # Try multiple possible content selectors
            content_selectors = [
                "main",
                "article",
                ".main-content",
                ".content",
                "#content",
                ".documentation-content",
                "div[role='main']"
            ]
            
            content_element = None
            for selector in content_selectors:
                try:
                    content_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                    logger.debug(f"Found content using selector: {selector}")
                    break
                except TimeoutException:
                    continue
            
            if not content_element:
                logger.warning("Could not find main content area, using body")
                content_element = driver.find_element(By.TAG_NAME, "body")
            
            # Get the HTML content
            html_content = content_element.get_attribute("innerHTML")
            
            # Convert to markdown using markdownify for richer parsing
            markdown_content = md(
                html_content,
                heading_style="ATX",
                bullets="*",
                code_language="spl",
                strip=['script', 'style']
            )
            
            # Clean up the markdown
            markdown_content = self._clean_markdown(markdown_content)
            
            return markdown_content
            
        except Exception as e:
            logger.error(f"❌ Error extracting content: {e}")
            return ""
    
    def _clean_markdown(self, markdown: str) -> str:
        """Clean and format markdown content"""
        # Remove excessive blank lines
        markdown = re.sub(r'\n{3,}', '\n\n', markdown)
        
        # Remove trailing whitespace
        lines = [line.rstrip() for line in markdown.split('\n')]
        markdown = '\n'.join(lines)
        
        # Ensure file ends with newline
        markdown = markdown.strip() + '\n'
        
        return markdown
    
    def _scrape_page(self, url: str, section_dir: Path, filename: str, max_retries: int = 2) -> bool:
        """Scrape a single page and save to markdown with retry logic"""
        if url in self.processed_urls:
            logger.debug(f"⏭️  Skipping already processed: {url}")
            return True
        
        logger.info(f"📄 Scraping: {url}")
        
        for attempt in range(max_retries):
            driver = None
            try:
                driver = self._create_driver()
                driver.get(url)
                
                # Wait for page to load
                WebDriverWait(driver, 15).until(
                    lambda d: d.execute_script("return document.readyState") == "complete"
                )
                
                # Extract content
                content = self._extract_main_content(driver)
                
                if not content:
                    logger.warning(f"⚠️  No content extracted from {url}")
                    if attempt < max_retries - 1:
                        logger.debug(f"🔄 Retrying... (attempt {attempt + 2}/{max_retries})")
                        continue
                    return False
                
                # Save to file
                output_file = section_dir / f"{filename}.md"
                output_file.write_text(content, encoding='utf-8')
                
                self.processed_urls.add(url)
                logger.success(f"✅ Saved: {output_file.relative_to(self.output_dir)}")
                
                return True
                
            except Exception as e:
                if attempt < max_retries - 1:
                    logger.warning(f"⚠️  Error on attempt {attempt + 1}: {str(e)[:100]}")
                    logger.debug(f"🔄 Retrying... (attempt {attempt + 2}/{max_retries})")
                else:
                    logger.error(f"❌ Failed after {max_retries} attempts: {str(e)[:100]}")
                    return False
                
            finally:
                if driver:
                    try:
                        driver.quit()
                    except:
                        pass
        
        return False
    
    def _process_section(self, section_name: str, section_url: str):
        """Process a complete documentation section"""
        logger.info(f"🚀 Processing section: {section_name}")
        logger.info(f"🔗 URL: {section_url}")
        
        # Create section directory
        section_dir = self.output_dir / self._sanitize_filename(section_name)
        section_dir.mkdir(exist_ok=True, parents=True)
        
        # Extract the first page filename from the entry URL
        # e.g., ".../introduction/understanding-spl-syntax" -> "understanding-spl-syntax"
        entry_url_path = urlparse(section_url).path
        entry_page_name = entry_url_path.rstrip('/').split('/')[-1]
        
        # Get all links from the page body (no sidebar searching)
        driver = self._create_driver()
        try:
            driver.get(section_url)
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            
            pages = self._get_sidebar_links(driver, section_url)
            
        finally:
            driver.quit()
        
        # CRITICAL: Always ensure the entry page is included
        entry_url_clean = section_url.split('#')[0]
        entry_page_exists = any(p['url'] == entry_url_clean for p in pages)
        
        if not entry_page_exists:
            logger.warning(f"⚠️  Entry page not found in links, adding it manually")
            pages.insert(0, {
                "title": section_name,
                "url": entry_url_clean,
                "filename": entry_page_name
            })
        
        if not pages:
            logger.warning(f"⚠️  No pages found in section, processing only the entry page")
            pages = [{"title": entry_page_name, "url": section_url, "filename": entry_page_name}]
        
        # Process pages in parallel with higher concurrency
        logger.info(f"🔄 Processing {len(pages)} pages in parallel...")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = []
            for page in pages:
                # Use filename from URL, not from link text
                filename = page.get('filename', self._sanitize_filename(page['title']))
                future = executor.submit(
                    self._scrape_page,
                    page['url'],
                    section_dir,
                    filename
                )
                futures.append((future, page['title']))
            
            # Wait for all to complete with progress tracking
            completed = 0
            success_count = 0
            for future, title in futures:
                try:
                    success = future.result(timeout=90)  # Increased timeout
                    completed += 1
                    if success:
                        success_count += 1
                        logger.debug(f"✓ Completed: {title} ({completed}/{len(pages)})")
                    else:
                        logger.warning(f"⚠️  Failed to process: {title} ({completed}/{len(pages)})")
                except concurrent.futures.TimeoutError:
                    completed += 1
                    logger.error(f"⏱️  Timeout processing {title} ({completed}/{len(pages)})")
                except Exception as e:
                    completed += 1
                    logger.error(f"❌ Exception processing {title}: {str(e)[:100]} ({completed}/{len(pages)})")
            
            logger.info(f"📊 Section stats: {success_count}/{len(pages)} pages successfully scraped")
        
        logger.success(f"🎉 Completed section: {section_name}")
    
    def crawl_all_sections(self, sections: Dict[str, str]):
        """Crawl all documentation sections"""
        logger.info("=" * 80)
        logger.info("🌊 Starting Splunk Documentation Crawler")
        logger.info(f"📂 Output directory: {self.output_dir.absolute()}")
        logger.info(f"📚 Sections to process: {len(sections)}")
        logger.info("=" * 80)
        
        for idx, (section_name, section_url) in enumerate(sections.items(), 1):
            logger.info("")
            logger.info(f"{'=' * 80}")
            logger.info(f"Section {idx}/{len(sections)}")
            logger.info(f"{'=' * 80}")
            
            try:
                self._process_section(section_name, section_url)
            except Exception as e:
                logger.error(f"❌ Failed to process section {section_name}: {e}")
                continue
        
        logger.info("")
        logger.info("=" * 80)
        logger.success(f"🎊 Crawling complete! Processed {len(self.processed_urls)} pages")
        logger.info("=" * 80)


def main():
    """Main entry point"""
    # Load sections from SECTIONS.json
    sections_file = Path(__file__).parent / "SECTIONS.json"
    
    try:
        with open(sections_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Convert to dict format expected by crawler
        sections = {section['name']: section['url'] for section in config['sections']}
        
        logger.info(f"📖 Loaded {len(sections)} sections from {sections_file.name}")
        
    except FileNotFoundError:
        logger.error(f"❌ SECTIONS.json not found at {sections_file}")
        logger.info("💡 Please create SECTIONS.json with section definitions")
        return
    except json.JSONDecodeError as e:
        logger.error(f"❌ Invalid JSON in SECTIONS.json: {e}")
        return
    except KeyError as e:
        logger.error(f"❌ Missing required key in SECTIONS.json: {e}")
        return
    
    crawler = SplunkDocCrawler(output_dir="../documentation")
    crawler.crawl_all_sections(sections)


if __name__ == "__main__":
    main()
