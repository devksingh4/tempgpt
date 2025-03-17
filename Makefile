build:
	zip -r addon.zip . -x "compliance/*" "temp/*" ".gitignore" "README.md"  ".github/*" ".github/**/*" ".git/*" ".git/**/*" $(git ls-files --others --ignored --exclude-standard)
