# Changelog

## 2025-10-20 - Improved Link Extraction and Debugging

### Changed
- Reworked link extraction to use JavaScript attribute reads instead of relying on repeated CSS selector probing or element attribute calls
- Added logging of total links found on a page before processing
- Added lightweight debug scripts to inspect large sections (notably `search-commands`) and confirm filter behavior

### Debugging
- Created `debug_search_commands.py` to enumerate anchors and DOM containers on the `search-commands` entry page
- Created `debug_filtering.py` to run the crawler's filtering rules against the entry page and report pass/fail counts
- Debug findings: ~160 valid `search-commands` pages pass the implemented filters (others were anchors, other manuals, or duplicates)

## 2025-10-20 - Migrated to JSON Configuration

### Changed
- Sections are now defined in `SECTIONS.json` and loaded at runtime (improves maintainability and makes the set of entry pages explicit)
- Better error handling and user-friendly messages when the JSON file is missing or malformed

### Added
- `SECTIONS.json` with structured section definitions (name + entry URL)
- File path resolution using `Path(__file__).parent`

## 2025-10-20 - Fixed Stale Elements and Ensured Entry Pages

### Fixed
- Replaced Selenium attribute reads with JavaScript-based extraction (prevents stale element errors when the DOM changes during iteration)
- Guaranteed that the entry page for each section (from `SECTIONS.json`) is included as the first page for that section

### Implementation
- Use `driver.execute_script(...)` to read `href` and `textContent` for anchors in a single pass, then post-process the collected data
- After the link extraction pass, add the section's entry page if it wasn't present in the link set

## 2025-10-20 - Reliability and Performance Improvements

### Fixed
- Eliminated stale element reference errors by extracting all link attributes into memory before processing
- Added per-page retry logic (default 2 attempts) to handle transient network or browser issues

### Changed
- Increased parallel workers per section to 10 (configurable) to improve throughput while keeping each section's files grouped
- Increased page load timeout to 15s and per-task timeout to 90s for more reliable scraping of complex pages
- Added section-level statistics and improved error categorization in logs

### Implementation
- Two-pass extraction: JavaScript reads -> in-memory list -> filtering/dedupe -> submission to thread pool
- Retry mechanism with full WebDriver teardown between attempts
- Detailed logging for timeouts, exceptions, and per-page success/failure counts

## 2025-10-20 - Performance Improvements and Filename Fixes

### Changed
- Removed multiple slow sidebar selector fallbacks; now the crawler reads anchors from the page body with JS (faster and more robust)
- Filenames are derived from the URL path segment (consistent and predictable names)

### Implementation
- Extract filename from the final path segment of the page URL
- Entry page filename is taken from the section's entry URL (ensures predictable first-page naming)

## 2025-10-20 - Anchor Handling and Strict Section Filtering

### Fixed
- Anchor fragments (the part after `#`) are stripped from URLs before deduplication to avoid treating anchors as separate pages
- Added strict filtering: a page must belong to the 10.0 manual (path contains `/10.0/`) and include the section identifier in its path to be processed

### Implementation
- Normalize URLs by removing fragments and deduplicate by the cleaned URL
- Apply two-level filtering: (1) contains `/10.0/` and (2) contains `/{section_identifier}/`

## 2025-10-20 - Fix: Section Scoping

### Fixed
- Prevented cross-section bleed by deriving a section identifier from the entry URL and requiring it to be present in candidate page paths

### Changed
- Enhanced debug logging to indicate why a link was skipped (duplicate, wrong manual, wrong section, etc.)

## 2025-10-20 - Improved Logging and Progress

### Changed
- Added progress logging for parallel page processing (shows X/Total completed)
- More explicit logs when searching for the main content area and when falling back from missing expected selectors
- Clearer skip reasons for links (not in manual, duplicate, wrong section, non-Splunk domain)

### Fixed
- Avoided long selector-based waits by moving to JS-based extraction; this improves responsiveness and reduces perception of being "stuck"

## 2025-10-20 - Initial Implementation

### Added
- Created `splunk_crawler.py` implementing `SplunkDocCrawler`
- Features:
  - Selenium WebDriver integration with Chrome headless mode
  - Two-pass JS-based link extraction for robustness
  - Rich HTML → Markdown conversion (markdownify primary, html2text fallback)
  - Parallel page processing within sections using ThreadPoolExecutor (default 10 workers)
  - URL normalization and deduplication
  - Comprehensive error handling and per-page retry
  - Loguru-based rich logging with progress indicators

### Implementation Details
- Sections processed sequentially; pages within a section processed in parallel
- Each concurrent worker uses an independent WebDriver instance
- Filenames derived from URL path segments, sanitized for filesystems
- Markdown cleanup and normalization applied after conversion

### Technical Decisions
- `markdownify` chosen for primary conversion
- ThreadPoolExecutor used due to Selenium's blocking sync APIs
- Headless Chrome for consistent rendering
- Default timeouts adjusted for stability: 15s page load, 90s per-task timeout
- ATX-style headings (#, ##, ###) for better markdown compatibility
