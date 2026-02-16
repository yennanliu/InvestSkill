# GitHub Pages Setup Guide

This guide will help you enable GitHub Pages for your InvestSkill repository.

## Prerequisites

- Repository must be public (or you need GitHub Pro/Team for private repos)
- You must have admin access to the repository

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/yennanliu/InvestSkill`

2. Click on **Settings** tab

3. In the left sidebar, click **Pages** (under "Code and automation")

4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (The default is "Deploy from a branch" - make sure to change it to "GitHub Actions")

5. Click **Save**

### 2. Push the Workflow

The workflow file has already been created at `.github/workflows/deploy-pages.yml`. You just need to commit and push:

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: add GitHub Pages deployment workflow"
git push origin main
```

### 3. Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, you'll see a green checkmark ✅

### 4. Access Your Site

Your site will be available at:
```
https://yennanliu.github.io/InvestSkill/
```

Or if using a custom domain:
```
https://your-custom-domain.com
```

## Automatic Updates

The workflow is configured to run automatically:
- **On every push to `main` branch** - Your site will update automatically
- **Manual trigger** - You can also trigger it manually from the Actions tab

## Custom Domain (Optional)

To use a custom domain:

1. In repository **Settings** > **Pages**
2. Under "Custom domain", enter your domain (e.g., `investskill.com`)
3. Click **Save**
4. Add DNS records with your domain provider:
   - For apex domain (example.com):
     ```
     A    185.199.108.153
     A    185.199.109.153
     A    185.199.110.153
     A    185.199.111.153
     ```
   - For subdomain (www.example.com):
     ```
     CNAME www.example.com yennanliu.github.io
     ```

## Troubleshooting

### Site Not Loading

- Check that GitHub Pages is enabled in Settings > Pages
- Verify the workflow completed successfully in Actions tab
- Make sure repository is public (or you have Pro/Team)
- Wait a few minutes for DNS propagation

### Workflow Failed

- Check the workflow logs in the Actions tab
- Common issues:
  - Permissions: Make sure workflow has `pages: write` permission
  - Node.js modules: Dependencies should install automatically
  - Build errors: Check the build-site.js script output

### 404 Errors

- Make sure you're accessing the correct URL
- Check that the workflow deployed successfully
- Verify files were uploaded (check workflow artifact)

## Verify Setup

After deployment, verify these pages work:
- Main page: `https://yennanliu.github.io/InvestSkill/`
- Contributing: `https://yennanliu.github.io/InvestSkill/contributing.html`
- Changelog: `https://yennanliu.github.io/InvestSkill/changelog.html`

## Update Site Content

To update your website:

1. Edit README.md, CONTRIBUTING.md, or CHANGELOG.md
2. Commit and push to main:
   ```bash
   git add README.md
   git commit -m "docs: update readme"
   git push origin main
   ```
3. The site will automatically rebuild and deploy

## Adding Badges to README

Once your site is live, add this badge to your README.md:

```markdown
![Deploy](https://github.com/yennanliu/InvestSkill/actions/workflows/deploy-pages.yml/badge.svg)
[![Website](https://img.shields.io/badge/website-live-success)](https://yennanliu.github.io/InvestSkill/)
```

## Support

If you encounter issues:
1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review workflow logs in Actions tab
3. Open an issue in the repository

---

**That's it!** Your InvestSkill documentation site should now be live at:
**https://yennanliu.github.io/InvestSkill/**
