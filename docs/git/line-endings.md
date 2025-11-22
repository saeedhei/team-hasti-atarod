# Git Line Endings (LF)

Our project uses **LF** line endings across all tools (Git, VSCode, Prettier) to avoid inconsistent formatting between environments.

## 📄 .gitattributes

The project defines line endings via `.gitattributes`:

text=auto eol=lf

This ensures:

- Git **detects text files automatically**
- All text files use **LF** on checkout and commit

## 🔧 Git Configuration

Make sure your local Git is also configured for LF:

```bash
git config --global core.autocrlf false
git config --global core.eol lf
```

This prevents Git from rewriting line endings to CRLF on Windows.

♻️ Renormalize Existing Files

After updating `.gitattributes`, run:

```bash
git add --renormalize .
git commit -m "Normalize line endings"
```

📝 Notes

You may see warnings about `LF replaced by CRLF` if your Git was previously misconfigured.

After fixing the config once, the warning should disappear.
