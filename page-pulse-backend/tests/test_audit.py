from app.services.parser import parse_html

def test_parse_html_happy_path():
    """Test with a perfect, well-structured HTML string."""
    html = """
    <html>
        <head>
            <title>Perfect Page</title>
            <meta name="description" content="A perfect test description.">
        </head>
        <body>
            <h1>First H1</h1>
            <h1>Second H1</h1>
            <img src="good.jpg" alt="A good image">
            <img src="bad1.jpg" alt="">
            <img src="bad2.jpg">
            <p>This is a test paragraph with exactly nine words.</p>
        </body>
    </html>
    """
    result = parse_html(html)
    
    assert result["title"] == "Perfect Page"
    assert result["meta_description"] == "A perfect test description."
    assert result["h1_count"] == 2
    # Two images are missing proper alt text (one is empty, one lacks the attribute entirely)
    assert result["images_missing_alt_text"] == 2 
    # Title (2) + Description (4) + H1s (4) + Alt (3) + Paragraph (9) = roughly 22 words
    assert result["approximate_word_count"] > 10 

def test_parse_html_missing_elements():
    """Failure Case 1: HTML missing key tags like meta descriptions and H1s."""
    html = """
    <html>
        <head>
            <title>Incomplete Page</title>
        </head>
        <body>
            <p>Just some plain text without headings.</p>
        </body>
    </html>
    """
    result = parse_html(html)
    
    assert result["title"] == "Incomplete Page"
    assert result["meta_description"] is None
    assert result["h1_count"] == 0
    assert result["images_missing_alt_text"] == 0

def test_parse_html_empty_string():
    """Failure Case 2: Completely empty or malformed HTML."""
    html = ""
    result = parse_html(html)
    
    assert result["title"] is None
    assert result["meta_description"] is None
    assert result["h1_count"] == 0
    assert result["images_missing_alt_text"] == 0
    assert result["approximate_word_count"] == 0