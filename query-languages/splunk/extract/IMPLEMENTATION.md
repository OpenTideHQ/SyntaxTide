# Implementation Details

## Overview
The Splunk SPL Reference documentation crawler is implemented using Selenium WebDriver with Chrome in headless mode for robust web scraping and markdown conversion.

## Architecture

### Main Components

1. **SplunkDocCrawler Class**
  - Orchestrates scraping for each documentation section
  - Creates and tears down Chrome WebDriver instances per page to avoid cross-thread contamination
  - Tracks processed URLs and file writes to prevent duplicates and collisions
  - Converts HTML to rich Markdown using `markdownify` (with `html2text` as fallback)

2. **Key Methods**

  - `_create_driver()`: Creates a headless Chrome WebDriver configured for reliability in CI/server environments
  - `_get_sidebar_links()`: Extracts links from the page body using JavaScript-based attribute reads to avoid stale elements
  - `_extract_main_content()`: Finds the main content area and converts HTML to Markdown
  - `_scrape_page()`: Scrapes a single page with retry logic and saves to the filesystem
  - `_process_section()`: Processes a full section (concurrent page scrapes, ensures entry-page presence)
  - `crawl_all_sections()`: Loads `SECTIONS.json` and orchestrates section processing sequentially

### Technology Stack

- **Selenium WebDriver**: For browser automation and JavaScript rendering
- **Chrome (headless)**: Browser engine for rendering pages
- **markdownify**: Primary library for rich HTML to Markdown conversion
- **html2text**: Backup HTML to Markdown converter
- **loguru**: Rich, colorized logging with timestamps
- **concurrent.futures**: ThreadPoolExecutor for parallel page processing

### Concurrency Model

- **Sections**: Processed sequentially (one section at a time to preserve logical grouping and filesystem layout)
- **Pages within a section**: Processed in parallel using ThreadPoolExecutor with 10 workers (configurable)
- Each page receives its own WebDriver instance to avoid shared-state and DOM contention
- Thread-safe URL deduplication via an in-memory Set
- Retry logic: Up to 2 attempts per page (configurable) to handle transient network/browser failures

### Error Handling & Reliability

- **Stale Element Prevention**: Two-pass link extraction with JavaScript attribute reads
  1. First pass: Use JavaScript (`driver.execute_script`) to read `href` and `textContent` for each anchor; store in-memory
  2. Second pass: Process the extracted data (filtering / normalization / deduplication)
  - Reading attributes via JS avoids Selenium `stale element` errors when the DOM mutates during scraping
  
- **Retry Logic**: Per-page retry policy (default 2 attempts)
  - Handles connection resets, timeouts, transient failures
  - Ensures WebDriver is properly closed between retries
  
- **Graceful Degradation**: Individual page failures don't abort section processing
  - Section completes with stats on successes/failures

### Markdown Conversion

- Uses `markdownify` library for rich markdown output
- Preserves:
  - Headings (ATX style with #)
  - Links and images
  - Code blocks (tagged as 'spl' language)
  - Lists and tables
  - Text formatting (bold, italic, etc.)
- Post-processing cleanup:
  - Removes excessive blank lines
  - Strips trailing whitespace
  - Ensures consistent formatting

### File Organization

- Output directory: `../documentation/`
- Structure: `documentation/<section-name>/<page-name>.md`
- Filenames are sanitized (lowercase, special chars replaced with dashes)
- Duplicate prevention via URL tracking

### Error Handling

- Graceful fallbacks for sidebar/content selectors
- Timeout handling (10s for page loads, 60s for page processing)
- Individual page failures don't stop section processing
- Detailed logging at each step

### Logging

- Color-coded log levels (DEBUG, INFO, SUCCESS, WARNING, ERROR)
- Timestamps on all messages
- Progress indicators with emojis for better readability
- Function and line number tracking for debugging

## Configuration

- **Headless mode**: Enabled by default
- **Window size**: 1920x1080 for consistent rendering
- **Parallel workers**: 5 threads per section
- **Timeouts**: 10s page load, 60s total processing per page
