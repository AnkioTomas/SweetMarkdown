import sweet from "#sweet/SweetEngineBase.js";

test("h1",()=>{
    expect(sweet.toHtml('# Hello \n')).toBe('<sweet-header level="1" count="1" sign="086e3260a03df4fd71b6520f83c9e316"> Hello </sweet-header>\n');
    expect(sweet.toHtml(' Hello \n----')).toBe('<sweet-header level="2" count="1" sign="c3cc6da321554b835476608434f688aa">Hello</sweet-header>\n');
})
