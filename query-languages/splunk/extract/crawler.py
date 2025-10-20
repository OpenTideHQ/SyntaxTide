#!/usr/bin/env python3
"""
Splunk Search Reference Documentation Crawler

This script crawls the Splunk Search Reference documentation from help.splunk.com,
extracts content from all pages listed in the sidebar, and converts them to markdown.

Requirements:
    pip install requests beautifulsoup4 html2text lxml

Usage:
    python crawler.py
"""

import os
import re
import sys
import time
import json
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
import html2text
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from loguru import logger


class SplunkDocCrawler:
    """Crawls Splunk documentation and converts to markdown."""
    
    BASE_URL = "https://help.splunk.com"
    START_URL = "https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.0/introduction/welcome-to-the-search-reference"
    
    def __init__(self, proxies: Optional[Dict[str, str]] = None, verbose: bool = True):
        """
        Initialize the crawler.
        
        Args:
            proxies: Optional proxy configuration dict, e.g., {'http': 'http://proxy:8080', 'https': 'https://proxy:8080'}
            verbose: Enable verbose logging
        """
        
        logger.info("🚀 Initializing Splunk Documentation Crawler...")
        
        # Set output directory to ../documentation relative to this script
        script_dir = Path(__file__).parent
        self.output_dir = script_dir.parent / "documentation"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        logger.success(f"📁 Output directory: {self.output_dir}")
        
        self.proxies = proxies
        if self.proxies:
            logger.info(f"🌐 Proxy configured: {list(self.proxies.keys())}")
        
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Track visited URLs to avoid duplicates
        self.visited_urls = set()
        
        # Store hierarchy for nested pages
        self.page_hierarchy = []
        
        # Configure html2text
        self.html_converter = html2text.HTML2Text()
        self.html_converter.ignore_links = False
        self.html_converter.ignore_images = False
        self.html_converter.ignore_emphasis = False
        self.html_converter.body_width = 0  # Don't wrap lines
        
        # Session for connection pooling (used for non-JS requests)
        logger.info("🔧 Setting up HTTP session...")
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Setup Selenium WebDriver
        logger.info("🌐 Setting up Selenium WebDriver (this may take a moment)...")
        self.driver = self._setup_selenium(proxies)
        logger.success("✅ Selenium WebDriver ready!")
    
    def _setup_selenium(self, proxies: Optional[Dict[str, str]] = None) -> webdriver.Chrome:
        """
        Setup Selenium Chrome WebDriver with options.
        
        Args:
            proxies: Optional proxy configuration
            
        Returns:
            Configured Chrome WebDriver instance
        """
        logger.debug("⚙️  Configuring Chrome options...")
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Run in background
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        # Add proxy if provided
        if proxies and 'http' in proxies:
            proxy_url = proxies['http'].replace('http://', '').replace('https://', '')
            chrome_options.add_argument(f'--proxy-server={proxy_url}')
            logger.debug(f"🔒 Proxy server: {proxy_url}")
            
            # Set environment variables for webdriver-manager to use proxy
            logger.debug("🌐 Setting proxy environment variables for ChromeDriver download...")
            os.environ['HTTP_PROXY'] = proxies.get('http', '')
            os.environ['HTTPS_PROXY'] = proxies.get('https', proxies.get('http', ''))
            os.environ['http_proxy'] = proxies.get('http', '')
            os.environ['https_proxy'] = proxies.get('https', proxies.get('http', ''))
            logger.debug("✅ Proxy environment variables set")
        
        # Install and setup ChromeDriver
        logger.info("📥 Downloading ChromeDriver (this uses your proxy if configured)...")
        try:
            service = Service(ChromeDriverManager().install())
            logger.success("✅ ChromeDriver installed successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to download ChromeDriver: {e}")
            logger.warning("💡 Trying alternative: checking for existing ChromeDriver...")
            # Try to find existing chromedriver
            import shutil
            chromedriver_path = shutil.which('chromedriver')
            if chromedriver_path:
                logger.success(f"✅ Found existing ChromeDriver: {chromedriver_path}")
                service = Service(chromedriver_path)
            else:
                logger.error("❌ No existing ChromeDriver found. Please install manually or fix proxy.")
                raise
        
        logger.debug("🚗 Starting Chrome browser (headless mode)...")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(60)
        logger.debug("⏱️  Page load timeout: 60 seconds")
        
        return driver
    
    def __del__(self):
        """Cleanup: close Selenium driver."""
        if hasattr(self, 'driver'):
            try:
                logger.info("🛑 Closing Selenium WebDriver...")
                self.driver.quit()
                logger.success("✅ WebDriver closed")
            except Exception as e:
                logger.warning(f"⚠️  Error closing WebDriver: {e}")
    
    def get_page(self, url: str, use_selenium: bool = True) -> Optional[BeautifulSoup]:
        """
        Fetch a page and return BeautifulSoup object.
        
        Args:
            url: URL to fetch
            use_selenium: If True, use Selenium for JavaScript rendering. If False, use requests.
            
        Returns:
            BeautifulSoup object or None if failed
        """
        try:
            method = "🌐 Selenium" if use_selenium else "⚡ Requests"
            logger.info(f"📡 Fetching page ({method}): {url}")
            
            if use_selenium:
                # Use Selenium for JavaScript-rendered content
                logger.debug("🔄 Loading page with Selenium...")
                self.driver.get(url)
                logger.debug("✅ Page loaded, waiting for JavaScript to render...")
                
                # Wait for navigation tree to load
                try:
                    logger.debug("⏳ Waiting for navigation tree (.ezd-portal_nav-tree_root)...")
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.CLASS_NAME, "ezd-portal_nav-tree_root"))
                    )
                    logger.success("✨ Navigation tree found and loaded!")
                except Exception as e:
                    logger.warning(f"⚠️  Navigation tree not found (timeout after 15s), continuing anyway...")
                    logger.debug(f"Timeout details: {e}")
                
                # Additional wait for content to stabilize
                logger.debug("⏱️  Waiting 2 seconds for content to stabilize...")
                time.sleep(2)
                
                # Get page source after JavaScript execution
                logger.debug("📄 Extracting page source from rendered DOM...")
                html_content = self.driver.page_source
                logger.debug(f"📊 Page source size: {len(html_content):,} bytes")
                
                logger.debug("🔍 Parsing HTML with BeautifulSoup...")
                soup = BeautifulSoup(html_content, 'lxml')
                logger.success("✅ Page successfully fetched and parsed!")
                return soup
            else:
                # Use requests for static HTML
                logger.debug(f"📤 Sending HTTP GET request...")
                response = self.session.get(url, timeout=30, proxies=self.proxies)
                response.raise_for_status()
                logger.debug(f"✅ HTTP {response.status_code} - {len(response.content):,} bytes")
                
                logger.debug("🔍 Parsing HTML with BeautifulSoup...")
                soup = BeautifulSoup(response.content, 'lxml')
                logger.success("✅ Page successfully fetched and parsed!")
                return soup
                
        except Exception as e:
            logger.error(f"❌ Error fetching {url}: {e}")
            logger.exception("Stack trace:")
            return None
    
    def extract_sidebar_links(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """
        Extract all documentation links from the sidebar navigation.
        
        Args:
            soup: BeautifulSoup object of the page
            
        Returns:
            List of dicts with 'title', 'url', 'level', and 'parent' keys
        """
        logger.info("🔍 Extracting navigation links from sidebar...")
        links = []
        
        # Try to find the Splunk navigation tree (React component)
        logger.debug("🎯 Looking for primary selector: .ezd-portal_nav-tree_root")
        nav_tree = soup.find('div', class_='ezd-portal_nav-tree_root')
        
        if not nav_tree:
            # Fallback: try other selectors
            logger.warning("⚠️  Primary selector not found, trying fallback selectors...")
            sidebar_selectors = [
                {'class': 'ezd-portal_nav-tree_root'},
                {'class': 'sidebar'},
                {'class': 'navigation'},
                {'class': 'toc'},
                {'id': 'sidebar'},
                {'role': 'navigation'}
            ]
            
            for i, selector in enumerate(sidebar_selectors, 1):
                logger.debug(f"🔎 Attempt {i}/{len(sidebar_selectors)}: {selector}")
                nav_tree = soup.find('nav', attrs=selector) or soup.find('div', attrs=selector)
                if nav_tree:
                    logger.success(f"✨ Found navigation with selector: {selector}")
                    break
        
        if not nav_tree:
            # Last resort: try to find any navigation
            logger.warning("⚠️  Fallback selectors failed, trying generic nav/aside tags...")
            nav_tree = soup.find('nav') or soup.find('aside')
            if nav_tree:
                logger.info("✅ Found navigation using generic fallback")
        
        if not nav_tree:
            logger.error("❌ Could not find sidebar navigation with any selector!")
            return links
        
        logger.success("✨ Navigation tree found!")
        logger.debug("🔗 Extracting all <a> tags with href attribute...")
        
        # Extract all links from the navigation
        parent_stack = []
        all_nav_links = nav_tree.find_all('a', href=True)
        
        logger.info(f"📊 Found {len(all_nav_links)} raw navigation links")
        logger.debug("🧹 Filtering and processing links...")
        
        processed = 0
        skipped_empty = 0
        skipped_anchor = 0
        skipped_external = 0
        
        for link in all_nav_links:
            href = str(link.get('href', ''))
            title = link.get_text(strip=True)
            
            # Skip empty or anchor links
            if not title or not href:
                skipped_empty += 1
                continue
            
            if href.startswith('#'):
                skipped_anchor += 1
                continue
            
            # Skip non-documentation links
            if href.startswith('http') and 'help.splunk.com' not in href:
                skipped_external += 1
                continue
            
            processed += 1
            
            # Make absolute URL
            full_url = urljoin(self.BASE_URL, href)
            
            # Determine nesting level from depth class or parent structure
            level = 0
            class_attr = link.get('class')
            class_list = class_attr if isinstance(class_attr, list) else []
            depth_classes = [c for c in class_list if isinstance(c, str) and c.startswith('depth-')]
            if depth_classes:
                # Extract depth from class like 'depth-1'
                try:
                    level = int(depth_classes[0].split('-')[1])
                except:
                    level = len(link.find_parents('ul'))
            else:
                # Fallback: count parent ul elements
                level = len(link.find_parents('ul'))
            
            # Determine parent
            parent = parent_stack[level - 1] if level > 0 and len(parent_stack) >= level else None
            
            link_info = {
                'title': title,
                'url': full_url,
                'level': level,
                'parent': parent,
                'hierarchy': parent_stack[:level].copy() if parent_stack else []
            }
            
            links.append(link_info)
            
            # Update parent stack
            if level >= len(parent_stack):
                parent_stack.append(title)
            else:
                parent_stack[level] = title
                parent_stack = parent_stack[:level + 1]
        
        logger.info(f"📊 Link processing statistics:")
        logger.info(f"   ✅ Valid links: {len(links)}")
        logger.info(f"   ⊘ Skipped (empty): {skipped_empty}")
        logger.info(f"   ⊘ Skipped (anchors): {skipped_anchor}")
        logger.info(f"   ⊘ Skipped (external): {skipped_external}")
        logger.success(f"🎉 Extracted {len(links)} documentation links!")
        return links
    
    def sanitize_filename(self, text: str) -> str:
        """
        Convert text to a valid filename.
        
        Args:
            text: Text to sanitize
            
        Returns:
            Sanitized filename string
        """
        # Remove or replace invalid characters
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        return text.strip('-').lower()
    
    def build_filename(self, title: str, hierarchy: List[str]) -> str:
        """
        Build a filename from title and hierarchy.
        
        Args:
            title: Page title
            hierarchy: List of parent titles
            
        Returns:
            Filename with hierarchy (e.g., 'parent-child-grandchild.md')
        """
        parts = [self.sanitize_filename(h) for h in hierarchy if h]
        parts.append(self.sanitize_filename(title))
        
        # Remove duplicates while preserving order
        seen = set()
        unique_parts = []
        for part in parts:
            if part not in seen:
                seen.add(part)
                unique_parts.append(part)
        
        filename = '-'.join(unique_parts) + '.md'
        
        # Limit filename length
        if len(filename) > 200:
            filename = filename[:197] + '.md'
        
        return filename
    
    def extract_main_content(self, soup: BeautifulSoup) -> Optional[str]:
        """
        Extract the main content from a documentation page.
        
        Args:
            soup: BeautifulSoup object of the page
            
        Returns:
            HTML content as string or None
        """
        # Try multiple selectors for main content
        content_selectors = [
            {'class': 'main-content'},
            {'class': 'article-content'},
            {'class': 'content'},
            {'role': 'main'},
            {'id': 'main'},
            {'class': 'documentation'},
            {'class': 'doc-content'}
        ]
        
        main_content = None
        for selector in content_selectors:
            main_content = soup.find('main', attrs=selector) or soup.find('article', attrs=selector) or soup.find('div', attrs=selector)
            if main_content:
                break
        
        if not main_content:
            # Fallback: try to find the largest content div
            main_content = soup.find('article') or soup.find('main')
        
        if not main_content:
            print("Warning: Could not find main content area")
            return None
        
        # Remove navigation, footers, and other non-content elements
        for element in main_content.find_all(['nav', 'aside', 'header', 'footer']):
            element.decompose()
        
        # Remove scripts and styles
        for element in main_content.find_all(['script', 'style']):
            element.decompose()
        
        return str(main_content)
    
    def html_to_markdown(self, html_content: str, title: str, url: str) -> str:
        """
        Convert HTML content to markdown.
        
        Args:
            html_content: HTML content as string
            title: Page title for header
            url: Original URL for reference
            
        Returns:
            Markdown formatted string
        """
        # Convert HTML to markdown
        markdown = self.html_converter.handle(html_content)
        
        # Add header with metadata
        header = f"""# {title}

**Source**: [{url}]({url})

---

"""
        
        return header + markdown
    
    def save_markdown(self, content: str, filename: str) -> None:
        """
        Save markdown content to file.
        
        Args:
            content: Markdown content
            filename: Filename to save to
        """
        filepath = self.output_dir / filename
        
        try:
            logger.debug(f"💾 Writing to: {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.debug(f"📊 File size: {len(content):,} characters")
        except Exception as e:
            logger.error(f"❌ Error saving {filepath}: {e}")
    
    def crawl_page(self, url: str, title: str, hierarchy: List[str], use_selenium: bool = False) -> None:
        """
        Crawl a single page and save as markdown.
        
        Args:
            url: URL to crawl
            title: Page title
            hierarchy: List of parent titles
            use_selenium: Whether to use Selenium for this page
        """
        # Skip if already visited
        if url in self.visited_urls:
            logger.debug(f"⊙ Skipping (already visited): {title}")
            return
        
        self.visited_urls.add(url)
        
        # Fetch page
        logger.debug(f"📥 Fetching content for: {title}")
        soup = self.get_page(url, use_selenium=use_selenium)
        if not soup:
            logger.error(f"❌ Failed to fetch: {title}")
            return
        
        # Extract main content
        logger.debug(f"📝 Extracting main content...")
        html_content = self.extract_main_content(soup)
        if not html_content:
            logger.warning(f"⚠️  No content found for: {title}")
            return
        
        # Convert to markdown
        logger.debug(f"🔄 Converting HTML to Markdown...")
        markdown = self.html_to_markdown(html_content, title, url)
        
        # Build filename with hierarchy
        filename = self.build_filename(title, hierarchy)
        logger.debug(f"💾 Filename: {filename}")
        
        # Save markdown
        self.save_markdown(markdown, filename)
        logger.success(f"✅ Saved: {filename}")
        
        # Be nice to the server
        logger.debug("⏳ Waiting 1 second before next request...")
        time.sleep(1)
    
    def run(self) -> None:
        """
        Run the crawler starting from the welcome page.
        """
        print(f"Starting Splunk Documentation Crawler")
        print(f"=" * 60)
        print(f"Start URL: {self.START_URL}")
        print(f"Output directory: {self.output_dir}")
        print(f"Using Selenium for JavaScript rendering: Yes")
        if self.proxies:
            print(f"Proxy configuration: {self.proxies}")
        print("=" * 60)
        print()
        
        # Fetch the starting page with Selenium
        print("Step 1: Fetching starting page with Selenium...")
        soup = self.get_page(self.START_URL, use_selenium=True)
        if not soup:
            print("✗ Failed to fetch starting page")
            return
        print("✓ Starting page loaded successfully")
        print()
        
        # Extract all links from sidebar
        print("Step 2: Extracting sidebar links...")
        links = self.extract_sidebar_links(soup)
        print(f"✓ Found {len(links)} documentation pages")
        print()
        
        if len(links) == 0:
            print("✗ No links found. The page structure may have changed.")
            print("  Saving page HTML for debugging...")
            debug_file = self.output_dir / '_debug_page.html'
            with open(debug_file, 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print(f"  Debug HTML saved to: {debug_file}")
            return
        
        # Save links metadata
        print("Step 3: Saving links metadata...")
        links_file = self.output_dir / '_links_metadata.json'
        with open(links_file, 'w', encoding='utf-8') as f:
            json.dump(links, f, indent=2)
        print(f"✓ Saved links metadata to: {links_file}")
        print()
        
        # Crawl each page
        print(f"Step 4: Crawling {len(links)} pages...")
        print("=" * 60)
        for i, link_info in enumerate(links, 1):
            hierarchy = link_info.get('hierarchy', [])
            if isinstance(hierarchy, str):
                hierarchy = []  # Fix if hierarchy is mistakenly a string
            hierarchy_path = ' > '.join(hierarchy + [link_info['title']])
            print(f"\n[{i}/{len(links)}] {link_info['title']}")
            print(f"  Path: {hierarchy_path}")
            
            self.crawl_page(
                url=link_info['url'],
                title=link_info['title'],
                hierarchy=hierarchy,
                use_selenium=False  # Use faster requests for content pages
            )
        
        print()
        print("=" * 60)
        print(f"✅ Crawling complete!")
        print(f"   Processed: {len(self.visited_urls)} pages")
        print(f"   Output: {self.output_dir.absolute()}")
        print("=" * 60)


def main():
    """Main entry point."""
    import argparse
    
    # Configure loguru
    logger.remove()  # Remove default handler
    logger.add(
        sys.stderr,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        colorize=True,
        level="DEBUG"
    )
    
    parser = argparse.ArgumentParser(
        description='Crawl Splunk Search Reference documentation and convert to markdown'
    )
    parser.add_argument(
        '--http-proxy',
        help='HTTP proxy URL (e.g., http://proxy.example.com:8080)'
    )
    parser.add_argument(
        '--https-proxy',
        help='HTTPS proxy URL (e.g., https://proxy.example.com:8080)'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    # Adjust log level based on verbosity
    if not args.verbose:
        logger.remove()
        logger.add(
            sys.stderr,
            format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
            colorize=True,
            level="INFO"
        )
    
    # Build proxy configuration
    proxies = None
    if args.http_proxy or args.https_proxy:
        proxies = {}
        if args.http_proxy:
            proxies['http'] = args.http_proxy
        if args.https_proxy:
            proxies['https'] = args.https_proxy
        logger.info(f"🔒 Proxy configuration loaded")
    
    # Create and run crawler
    try:
        crawler = SplunkDocCrawler(proxies=proxies)
        crawler.run()
    except KeyboardInterrupt:
        logger.warning("\n⚠️  Crawling interrupted by user (Ctrl+C)")
        sys.exit(1)
    except Exception as e:
        logger.exception(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
