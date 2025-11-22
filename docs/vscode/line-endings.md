# VSCode Line Endings (LF)

VSCode must save all files using **LF** to match the project's Git and Prettier settings.

## ⚙️ VSCode Settings

The project includes a `.vscode/settings.json` with:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

💡 Notes

`.vscode/settings.json` applies only inside the project, not globally.

Combined with `.gitattributes`, this guarantees fully consistent LF usage.
