## Goal

- Parse out Splunk SPL Reference documentation site into markdown files.
- Target folder is ./documentation/
- Each documentation section must be a folder
- Each page in that section should respect the location section/page.md
- Markdown parsing MUST be rich
- We should maintain a single file called crawler.py

### Approach

- SECTIONS.md give you an entry point into each section
- You will likely need to use Selenium to correctly parse everything. Use the Chrome Driver.
- That entry point is the first page for the section, which you need to parse anyway.
- The page will contain sections in a sidebar. Locate it. Locate pages under it. Stick to your current section
- Within a section, parralelize page reads and documentation writes
- Move to the next section
- Use loguru for rich logging, put effort in embelishments

### Guardrails

- Ensure concurrent actions don't impact the page being written (e.g. duplicated content)
- Always keep trace of your implementation in IMPLEMENTATION.md
- Use IMPLEMENTATION.md as current content
- Use CHANGELOG.md to add entries with your changes
- Validate that python file passes validaton
- If you are asked to revert approaches, because you broke something - use that context.
- Do not generate debug files as you go without cleaning them first
- NEVER ask to run scripts to standard error. Just run them as normal python scripts