import zipfile
from xml.etree.ElementTree import XML

WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
PARA = WORD_NAMESPACE + 'p'
TEXT = WORD_NAMESPACE + 't'

def extract_text_from_docx(file_path):
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        xml_content = zip_ref.read('word/document.xml')
    tree = XML(xml_content)
    paragraphs = []
    for paragraph in tree.iter(PARA):
        texts = [node.text for node in paragraph.iter(TEXT) if node.text]
        if texts:
            paragraphs.append(' '.join(texts))
    return '\n\n'.join(paragraphs)

if __name__ == '__main__':
    file_path = '../../docs/Rubric - Hytel AI Coding Bootcamp.docx'
    print(extract_text_from_docx(file_path)) 