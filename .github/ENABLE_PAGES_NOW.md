# 🚨 ENABLE GITHUB PAGES - Do This FIRST! 🚨

## ⚠️ Important: You Must Enable GitHub Pages Before the Workflow Can Run

The deployment workflow is failing because GitHub Pages is not enabled yet. Follow these exact steps:

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Repository Settings

1. Open your browser and go to:
   ```
   https://github.com/yennanliu/InvestSkill/settings/pages
   ```

   OR manually navigate:
   - Go to `https://github.com/yennanliu/InvestSkill`
   - Click the **"Settings"** tab (top right)
   - Scroll down the left sidebar
   - Click **"Pages"** (under "Code and automation" section)

---

### Step 2: Configure GitHub Pages

You should see a page titled "GitHub Pages".

**Under "Build and deployment" section:**

1. **Source**: Click the dropdown menu
   - ❌ Do NOT select "Deploy from a branch"
   - ✅ SELECT: **"GitHub Actions"**

2. That's it! GitHub will automatically save this setting.

---

### Step 3: Verify the Setting

After selecting "GitHub Actions", you should see:

```
Source: GitHub Actions

Your site is ready to be published at https://yennanliu.github.io/InvestSkill/
```

---

### Step 4: Re-run the Failed Workflow

1. Go to the Actions tab:
   ```
   https://github.com/yennanliu/InvestSkill/actions
   ```

2. Click on the failed "Deploy to GitHub Pages" workflow

3. Click the **"Re-run all jobs"** button (top right)

   OR

4. Click **"Actions"** > **"Deploy to GitHub Pages"** (left sidebar) > **"Run workflow"** button

---

## ✅ What You Should See

After re-running the workflow:

1. **Green checkmark** on the workflow run (takes 1-2 minutes)
2. Your site will be live at: `https://yennanliu.github.io/InvestSkill/`
3. Future pushes to `main` will automatically update the site

---

## 🎯 Quick Checklist

- [ ] Go to Settings > Pages
- [ ] Set Source to "GitHub Actions" (NOT "Deploy from a branch")
- [ ] Re-run the failed workflow
- [ ] Wait 1-2 minutes
- [ ] Visit `https://yennanliu.github.io/InvestSkill/`

---

## 📸 Visual Guide

**What to look for in Settings > Pages:**

```
┌─────────────────────────────────────────┐
│  GitHub Pages                           │
├─────────────────────────────────────────┤
│                                         │
│  Build and deployment                   │
│                                         │
│  Source                                 │
│  ┌─────────────────────────────────┐  │
│  │ GitHub Actions            ▼     │  │  ← Select this!
│  └─────────────────────────────────┘  │
│                                         │
│  ☑️ Enforce HTTPS                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### Issue: "Pages" option not visible in Settings

**Solution:**
- Make sure your repository is **public** (Pages requires public repos unless you have GitHub Pro/Team)
- Check you have **admin access** to the repository

### Issue: Repository is private

**Options:**
1. Make the repository public (Settings > General > scroll down > Change visibility)
2. OR upgrade to GitHub Pro/Team to use Pages with private repos

### Issue: Workflow still failing after enabling Pages

**Check:**
1. Did you select "GitHub Actions" (not "Deploy from a branch")?
2. Wait 30 seconds after changing the setting, then re-run
3. Check workflow permissions:
   - Settings > Actions > General
   - Scroll to "Workflow permissions"
   - Select "Read and write permissions"
   - Click Save

---

## 🎉 Success!

Once the workflow runs successfully, your website will be live at:

**https://yennanliu.github.io/InvestSkill/**

You can verify by visiting these pages:
- Main: `https://yennanliu.github.io/InvestSkill/`
- Contributing: `https://yennanliu.github.io/InvestSkill/contributing.html`
- Changelog: `https://yennanliu.github.io/InvestSkill/changelog.html`

---

## 📞 Still Having Issues?

1. Check the workflow logs in Actions tab for specific errors
2. Verify your repository is public
3. Make sure you have admin access
4. Wait a few minutes and try again (GitHub sometimes needs time to propagate settings)

**Most common fix:** Just make sure "Source" is set to "GitHub Actions" (not "Deploy from a branch")!
