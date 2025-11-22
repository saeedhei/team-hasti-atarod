````md
# Prettier Line Endings (LF)

Prettier is configured to format files using **LF** to match Git and VSCode.

## ⚙️ `.prettierrc` Configuration

Add or verify:

```json
{
  "endOfLine": "lf"
}
```

This ensures Prettier always rewrites CRLF ➝ LF.

🧪 Check Formatting

Run:
`pnpm prettier --check .`

To auto-fix:

`pnpm prettier --write .`

💡 Notes

With Format on Save enabled in VSCode, most line-ending issues are fixed automatically.

Must be used together with `.gitattributes` to guarantee consistency across systems.
````
