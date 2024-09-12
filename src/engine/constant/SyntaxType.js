const SyntaxType = {
    INLINE: 0,      // 对应于行内的语法（例如斜体、加粗等）
    PARAGRAPH: 1,    // 对应于段落级别的语法（例如标题、列表等）,不可嵌套
    CONTAINER: 2 // 可以嵌套的容器语法
};
export default SyntaxType
