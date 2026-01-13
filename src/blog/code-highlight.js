import { createHighlighter } from 'shiki';
let mojoGrammar;
let highlighter;

async function highlightLegacyCode() {
  if (!mojoGrammar) {
    mojoGrammar = await fetch(
      'https://raw.githubusercontent.com/modularml/mojo-syntax/main/syntaxes/mojo.syntax.json'
    )
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  }
  const mojoLang = {
    id: 'mojo',
    scopeName: 'source.mojo',
    grammar: mojoGrammar,
    aliases: ['mojo', '🔥'],
  };

  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ['py', 'python', 'mojo', 'bash', 'c', 'cpp', 'yaml', 'markdown', 'json', 'llvm'],
      themes: ['material-theme-palenight'],
    });
  }

  await highlighter.loadLanguage(mojoLang);

  const legacyCodeBlocks = document.querySelectorAll('.text-rich-text .code');
  for (const codeBlock of legacyCodeBlocks) {
    let parts = codeBlock.className.split('language-');
    if (parts.length > 1) {
      const code = codeBlock.innerText;
      let language = parts[1].split(/[\s\n]/)[0];
      try {
        codeBlock.innerHTML = highlighter.codeToHtml(code, {
          lang: language,
          theme: 'material-theme-palenight',
        });
      } catch (error) {
        console.error('Error highting code:', error);
      }
    }
  }
}

export async function setupCodeBlocks() {
  const legacyCodeBlocks = document.querySelectorAll('.text-rich-text .code');

  const doesNeedHighlighter = legacyCodeBlocks.length > 0;
  if (!doesNeedHighlighter) {
    return;
  }
  highlightLegacyCode();
}
