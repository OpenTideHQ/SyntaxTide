# Splunk Documentation Crawler

This tool crawls the Splunk Search Reference documentation and converts it to markdown files using Selenium to handle JavaScript-rendered content.

## Installation

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

This includes: `requests`, `beautifulsoup4`, `html2text`, `lxml`, `selenium`, and `webdriver-manager`

2. **Chrome browser is required** - ChromeDriver will be installed automatically by webdriver-manager

## Usage

### Basic Usage

Run the crawler (outputs to `../documentation` directory):

```bash
python crawler.py
```

The script automatically saves all documentation to a `documentation` folder one level up from the script location:
```
.vscode/extensions/opentide-query-syntax/
├── documentation/
│   └── splunk/
│       ├── extract/
│       │   ├── crawler.py          ← Script location
│       │   ├── requirements.txt
│       │   └── README.md
│       └── documentation/          ← Output files here
│           ├── introduction-welcome.md
│           ├── search-commands-eval.md
│           ├── _links_metadata.json
│           └── ...
```

### Using a Proxy

If you're behind a corporate proxy or need to route traffic through a proxy:

```bash
# HTTP proxy only
python crawler.py --http-proxy http://proxy.example.com:8080

# HTTPS proxy only
python crawler.py --https-proxy https://proxy.example.com:8080

# Both HTTP and HTTPS
python crawler.py --http-proxy http://proxy.example.com:8080 --https-proxy https://proxy.example.com:8080

# With authentication
python crawler.py --http-proxy http://username:password@proxy.example.com:8080
```

## Features

- ✅ **JavaScript Rendering**: Uses Selenium to handle React/Next.js dynamic content
- ✅ **Automatic Sidebar Extraction**: Discovers all documentation pages from the navigation tree
- ✅ **Hierarchy Preservation**: Nested pages are named using `parent-child-grandchild.md` syntax
- ✅ **HTML to Markdown Conversion**: Clean conversion with proper formatting
- ✅ **Proxy Support**: Works in corporate environments with authenticated proxies
- ✅ **Metadata Tracking**: Saves source URLs and page hierarchy
- ✅ **Duplicate Prevention**: Tracks visited URLs to avoid re-processing
- ✅ **Hybrid Approach**: Uses Selenium for navigation, requests for content (faster)
- ✅ **Error Handling**: Gracefully handles network errors and missing content

## Output Structure

The crawler generates files in `../documentation/` (one level up from the script):

1. **Markdown Files**: One `.md` file per documentation page
   - Named using hierarchy: `introduction-welcome-to-the-search-reference.md`
   - Includes source URL at the top
   - Clean markdown formatting

2. **Metadata File**: `_links_metadata.json`
   - Contains all discovered links
   - Includes hierarchy information
   - Useful for understanding the documentation structure

## Example Output

For a page with hierarchy: **Introduction** → **About SPL** → **Commands**

Filename: `introduction-about-spl-commands.md`

```markdown
# Commands

**Source**: [https://help.splunk.com/en/splunk-enterprise/...]

---

## Search Commands

The following commands are available...
```

## How It Works

1. **Selenium Setup**: Launches headless Chrome browser with optional proxy configuration
2. **JavaScript Execution**: Loads the welcome page and waits for React navigation tree (`.ezd-portal_nav-tree_root`) to render
3. **Sidebar Extraction**: Parses the fully-rendered navigation to find all documentation links with hierarchy
4. **Hierarchy Detection**: Extracts parent-child relationships from navigation depth classes and structure
5. **Content Crawling**: For each page:
   - Uses faster requests library (JavaScript not needed for content pages)
   - Extracts the main content area
   - Removes navigation, scripts, and other non-content elements
   - Converts HTML to clean markdown
6. **File Naming**: Builds hierarchical filenames from parent paths
7. **Save**: Writes markdown to output directory and metadata to JSON

## Troubleshooting

### No Links Found (0 pages)

The most common issue. Solutions:

1. **Check Chrome installation**: Selenium requires Chrome browser
2. **Verify proxy settings**: If behind corporate firewall, ensure proxy is correctly configured
3. **Check debug output**: The crawler saves `_debug_page.html` - inspect it to see what was loaded
4. **Increase timeout**: Edit `crawler.py` line ~100:
   ```python
   WebDriverWait(self.driver, 30).until(  # Increase from 15 to 30
   ```

### ChromeDriver Errors

```bash
# Update ChromeDriver automatically
pip install --upgrade webdriver-manager

# Or manually specify Chrome version
pip install webdriver-manager==4.0.1
```

### Proxy Authentication Fails

Ensure credentials are URL-encoded:
```bash
# For password with special characters: P@ssw0rd!
python crawler.py --http-proxy http://username:P%40ssw0rd%21@proxy.example.com:8080
```

### Connection Timeout

If Selenium times out loading pages:
- Check internet connectivity
- Verify Splunk documentation URL is accessible
- Try without proxy to isolate issue
- Increase page load timeout in `_setup_selenium()`:
  ```python
  driver.set_page_load_timeout(120)  # Increase from 60 to 120
  ```

### Memory Issues

Selenium can use significant memory. To reduce:
```python
# Edit _setup_selenium() in crawler.py
chrome_options.add_argument('--disable-images')  # Don't load images
chrome_options.add_argument('--window-size=1280,720')  # Smaller window
```

### Rate Limiting

If Splunk blocks requests:
- Increase delay in `crawl_page()` from 1 to 3 seconds
- Process in smaller batches
- Run during off-peak hours

## Advanced Usage

### Modify the Start URL

Edit `crawler.py` and change the `START_URL` constant:

```python
START_URL = "https://help.splunk.com/your/custom/path"
```

### Customize HTML to Markdown Conversion

Edit the `html_converter` settings in `__init__`:

```python
self.html_converter.ignore_links = True  # Don't include links
self.html_converter.body_width = 80      # Wrap at 80 characters
```

### Filter Specific Pages

Add filtering logic in the `run()` method:

```python
# Only crawl pages with "command" in the title
links = [l for l in links if 'command' in l['title'].lower()]
```

## Contributing

If you improve the crawler, please update this README with:
- New features
- Bug fixes
- Configuration options

## License

This tool is for documentation purposes only. Respect Splunk's terms of service and robots.txt.
