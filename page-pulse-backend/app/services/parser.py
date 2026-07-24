from bs4 import BeautifulSoup

def parse_html(html_content: str) -> dict:
    """Parses raw HTML and returns the required audit metrics."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Page Title
    title = soup.title.string.strip() if soup.title and soup.title.string else None
    
    # 2. Meta Description
    meta_tag = soup.find('meta', attrs={'name': 'description'})
    meta_description = meta_tag['content'].strip() if meta_tag and meta_tag.get('content') else None
    
    # 3. H1 Count
    h1_count = len(soup.find_all('h1'))
    
    # 4. Images Missing Alt Text
    images = soup.find_all('img')
    images_missing_alt_text = sum(1 for img in images if not img.get('alt') or img.get('alt').strip() == '')
    
    # 5. Approximate Word Count (extracts visible text and splits by whitespace)
    text = soup.get_text(separator=' ')
    words = text.split()
    approximate_word_count = len(words)
    
    return {
        "title": title,
        "meta_description": meta_description,
        "h1_count": h1_count,
        "images_missing_alt_text": images_missing_alt_text,
        "approximate_word_count": approximate_word_count
    }